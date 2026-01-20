"""
Django REST Framework Views for impact_tracker API.
"""

import logging
from datetime import datetime

from django.db.models import Sum, Avg, Count, F, Q, Max, Min
from django.http import FileResponse
from django.utils.timezone import now
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser

from .models import SDGGoal, Activity, SDGImpact, InstitutionMetric
from .serializers import (
    SDGGoalSerializer, ActivityListSerializer, ActivityDetailSerializer,
    ActivityCreateSerializer, SDGImpactSerializer, InstitutionMetricSerializer
)
from services.classifier import classify_activity_sdg

logger = logging.getLogger(__name__)


class SDGGoalViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for viewing SDG Goals.
    Endpoints:
        GET /api/sdg/ - List all SDG goals
        GET /api/sdg/{id}/ - Get specific SDG goal with impacts
    """
    queryset = SDGGoal.objects.all()
    serializer_class = SDGGoalSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'number'

    def get_queryset(self):
        """Get SDG goals, optionally filtered by number."""
        queryset = SDGGoal.objects.all()
        
        # Allow filtering by number in the URL (e.g., /api/sdg/1/)
        number = self.kwargs.get('number')
        if number:
            queryset = queryset.filter(number=number)
        
        return queryset

    @action(detail=True, methods=['get'])
    def activities(self, request, number=None):
        """
        Get all activities linked to a specific SDG.
        Endpoint: GET /api/sdg/{number}/activities/
        """
        try:
            sdg_goal = self.get_object()
        except SDGGoal.DoesNotExist:
            return Response(
                {'error': f'SDG Goal with number {number} not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Get activities with impacts for this SDG
        impacts = SDGImpact.objects.filter(sdg_goal=sdg_goal).select_related('activity')
        activities = [impact.activity for impact in impacts]

        serializer = ActivityDetailSerializer(activities, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def summary(self, request, number=None):
        """
        Get summary statistics for a specific SDG.
        Endpoint: GET /api/sdg/{number}/summary/
        """
        try:
            sdg_goal = self.get_object()
        except SDGGoal.DoesNotExist:
            return Response(
                {'error': f'SDG Goal with number {number} not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Calculate statistics
        impacts = SDGImpact.objects.filter(sdg_goal=sdg_goal)
        stats = impacts.aggregate(
            total_activities=Count('activity', distinct=True),
            average_score=Avg('score'),
            max_score=Max('score'),
            min_score=Min('score')
        )

        return Response({
            'sdg': SDGGoalSerializer(sdg_goal).data,
            'statistics': stats
        })


class ActivityViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Activity CRUD operations and AI classification.
    Endpoints:
        GET /api/activities/ - List all activities
        POST /api/activities/ - Create new activity (triggers AI classification)
        GET /api/activities/{id}/ - Get activity details
        PUT /api/activities/{id}/ - Update activity
        DELETE /api/activities/{id}/ - Delete activity
        POST /api/activities/upload/ - Upload activity (same as create, explicit endpoint)
    """
    queryset = Activity.objects.select_related('lead_author').prefetch_related('sdg_impacts')
    serializer_class = ActivityDetailSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def get_serializer_class(self):
        """Return appropriate serializer based on action."""
        if self.action == 'create':
            return ActivityCreateSerializer
        elif self.action == 'list':
            return ActivityListSerializer
        else:
            return ActivityDetailSerializer

    def get_queryset(self):
        """Get activities, optionally filtered by activity type or author."""
        queryset = super().get_queryset()
        
        # Filter by activity type if provided
        activity_type = self.request.query_params.get('activity_type')
        if activity_type:
            queryset = queryset.filter(activity_type=activity_type)
        
        # Filter by author if provided
        author_id = self.request.query_params.get('author')
        if author_id:
            queryset = queryset.filter(lead_author_id=author_id)
        
        # Filter by AI classification status if provided
        ai_classified = self.request.query_params.get('ai_classified')
        if ai_classified is not None:
            queryset = queryset.filter(ai_classified=ai_classified.lower() == 'true')
        
        return queryset

    def perform_create(self, serializer):
        """Save activity and trigger AI classification."""
        activity = serializer.save()
        self._classify_activity(activity)

    def perform_update(self, serializer):
        """Save updated activity."""
        serializer.save()

    def _classify_activity(self, activity):
        """
        Classify an activity using the AI classifier.
        Creates SDGImpact records for each identified SDG.
        """
        try:
            logger.info(f"Starting AI classification for Activity {activity.id}: {activity.title}")
            
            # Call the classifier
            impacts = classify_activity_sdg(activity.title, activity.description)
            
            # Create SDGImpact records for each identified SDG
            for impact_data in impacts:
                sdg_number = impact_data['sdg_number']
                score = impact_data['relevance_score']
                justification = impact_data['justification']
                
                try:
                    sdg_goal = SDGGoal.objects.get(number=sdg_number)
                    
                    # Create or update the impact record
                    SDGImpact.objects.update_or_create(
                        activity=activity,
                        sdg_goal=sdg_goal,
                        defaults={
                            'score': score,
                            'justification': justification
                        }
                    )
                    logger.debug(f"Created/Updated SDGImpact for SDG {sdg_number}: {score}%")
                    
                except SDGGoal.DoesNotExist:
                    logger.warning(f"SDG Goal with number {sdg_number} not found. Skipping.")
                    continue
            
            # Mark activity as classified
            activity.ai_classified = True
            activity.save(update_fields=['ai_classified'])
            
            logger.info(f"Successfully classified Activity {activity.id}. Created {len(impacts)} impacts.")
            
        except Exception as e:
            logger.error(f"Error classifying Activity {activity.id}: {str(e)}", exc_info=True)
            # Don't raise - let the activity be created even if classification fails

    @action(detail=False, methods=['post'], url_path='upload')
    def upload_activity(self, request):
        """
        Upload a new activity with automatic AI classification.
        This is an explicit endpoint for the upload operation.
        Endpoint: POST /api/activities/upload/
        """
        # Add the current user to the request data
        data = request.data.copy()
        data['lead_author'] = request.user.id
        
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        return Response(
            ActivityDetailSerializer(serializer.instance, context={'request': request}).data,
            status=status.HTTP_201_CREATED
        )


    @action(detail=False, methods=['get'])
    def by_author(self, request):
        """
        Get activities created by current user.
        Endpoint: GET /api/activities/by_author/
        """
        activities = self.get_queryset().filter(lead_author=request.user)
        serializer = self.get_serializer(activities, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def classify(self, request, pk=None):
        """
        Manually trigger AI classification for an activity.
        Endpoint: POST /api/activities/{id}/classify/
        """
        activity = self.get_object()
        
        # Clear existing impacts
        activity.sdg_impacts.all().delete()
        
        # Re-classify
        self._classify_activity(activity)
        
        serializer = self.get_serializer(activity)
        return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def dashboard_summary(request):
    """
    Get dashboard summary statistics.
    Endpoint: GET /api/dashboard/summary/
    
    Returns:
        - Total number of publications/activities
        - Top performing SDG by average score
        - Statistics by activity type
    """
    try:
        # Total publications
        total_activities = Activity.objects.count()
        
        # Total SDG impacts
        total_impacts = SDGImpact.objects.count()
        
        # Top performing SDG by average score
        top_sdg = SDGImpact.objects.values('sdg_goal__number', 'sdg_goal__name').annotate(
            avg_score=Avg('score'),
            total_impacts=Count('id')
        ).order_by('-avg_score').first()
        
        # Statistics by activity type
        activity_stats = Activity.objects.values('activity_type').annotate(
            count=Count('id'),
            avg_score=Avg('sdg_impacts__score')
        )
        
        # Most active authors (top 5)
        top_authors = Activity.objects.values('lead_author__username', 'lead_author__id').annotate(
            activity_count=Count('id')
        ).order_by('-activity_count')[:5]
        
        return Response({
            'total_activities': total_activities,
            'total_impacts': total_impacts,
            'top_performing_sdg': top_sdg,
            'activities_by_type': list(activity_stats),
            'top_authors': list(top_authors)
        })
    
    except Exception as e:
        logger.error(f"Error generating dashboard summary: {str(e)}", exc_info=True)
        return Response(
            {'error': 'Failed to generate dashboard summary'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def analytics_trends(request):
    """
    Get longitudinal data showing SDG impact trends.
    Groups SDGImpact scores by year (2020-2026).
    Endpoint: GET /api/analytics/trends/
    
    Query Parameters:
        - sdg_number: Filter by specific SDG (optional)
    
    Returns:
        Yearly trend data for SDG impacts
    """
    try:
        # Optional: filter by specific SDG
        sdg_number = request.query_params.get('sdg_number')
        
        query = SDGImpact.objects.select_related('sdg_goal', 'activity')
        
        if sdg_number:
            try:
                sdg_goal = SDGGoal.objects.get(number=sdg_number)
                query = query.filter(sdg_goal=sdg_goal)
            except SDGGoal.DoesNotExist:
                return Response(
                    {'error': f'SDG Goal with number {sdg_number} not found'},
                    status=status.HTTP_404_NOT_FOUND
                )
        
        # Group by year and SDG
        trends = {}
        for impact in query:
            year = impact.created_at.year
            sdg_num = impact.sdg_goal.number
            
            key = f"{year}-SDG{sdg_num}"
            
            if key not in trends:
                trends[key] = {
                    'year': year,
                    'sdg_number': sdg_num,
                    'sdg_name': impact.sdg_goal.name,
                    'scores': [],
                    'count': 0
                }
            
            trends[key]['scores'].append(impact.score)
            trends[key]['count'] += 1
        
        # Calculate averages
        for key in trends:
            scores = trends[key].pop('scores')
            trends[key]['average_score'] = sum(scores) / len(scores) if scores else 0
        
        # Sort by year and SDG
        sorted_trends = sorted(trends.values(), key=lambda x: (x['year'], x['sdg_number']))
        
        return Response({
            'trends': sorted_trends,
            'date_range': {'start': 2020, 'end': datetime.now().year}
        })
    
    except Exception as e:
        logger.error(f"Error generating analytics trends: {str(e)}", exc_info=True)
        return Response(
            {'error': 'Failed to generate analytics'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
