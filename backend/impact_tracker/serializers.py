"""
Django REST Framework Serializers for impact_tracker models.
"""

from rest_framework import serializers
from django.contrib.auth.models import User
from .models import SDGGoal, Activity, SDGImpact, InstitutionMetric


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model (read-only)."""

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')
        read_only_fields = ('id',)


class SDGGoalSerializer(serializers.ModelSerializer):
    """Serializer for SDGGoal model."""

    class Meta:
        model = SDGGoal
        fields = ('id', 'number', 'name', 'description', 'icon_url', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')


class SDGImpactSerializer(serializers.ModelSerializer):
    """Serializer for SDGImpact model."""
    sdg_goal_detail = SDGGoalSerializer(source='sdg_goal', read_only=True)

    class Meta:
        model = SDGImpact
        fields = ('id', 'activity', 'sdg_goal', 'sdg_goal_detail', 'score', 'justification', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')


class ActivityListSerializer(serializers.ModelSerializer):
    """Serializer for Activity model - used in list views."""
    lead_author_detail = UserSerializer(source='lead_author', read_only=True)
    activity_type_display = serializers.CharField(source='get_activity_type_display', read_only=True)

    class Meta:
        model = Activity
        fields = (
            'id', 'title', 'description', 'activity_type', 'activity_type_display',
            'lead_author', 'lead_author_detail', 'date_created', 'updated_at',
            'ai_classified', 'evidence_file'
        )
        read_only_fields = ('id', 'date_created', 'updated_at', 'ai_classified', 'evidence_file')


class ActivityDetailSerializer(serializers.ModelSerializer):
    """Serializer for Activity model - used in detail views with nested impacts."""
    lead_author_detail = UserSerializer(source='lead_author', read_only=True)
    activity_type_display = serializers.CharField(source='get_activity_type_display', read_only=True)
    sdg_impacts = SDGImpactSerializer(many=True, read_only=True)

    class Meta:
        model = Activity
        fields = (
            'id', 'title', 'description', 'activity_type', 'activity_type_display',
            'lead_author', 'lead_author_detail', 'date_created', 'updated_at',
            'ai_classified', 'evidence_file', 'sdg_impacts'
        )
        read_only_fields = ('id', 'date_created', 'updated_at', 'ai_classified')


class ActivityCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating Activity - used in POST requests."""

    class Meta:
        model = Activity
        fields = ('id', 'title', 'description', 'activity_type', 'evidence_file', 'lead_author')
        read_only_fields = ('id',)


class InstitutionMetricSerializer(serializers.ModelSerializer):
    """Serializer for InstitutionMetric model."""
    sdg_goal_detail = SDGGoalSerializer(source='sdg_goal', read_only=True)

    class Meta:
        model = InstitutionMetric
        fields = (
            'id', 'university_name', 'year', 'sdg_goal', 'sdg_goal_detail',
            'score', 'total_activities', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'created_at', 'updated_at')
