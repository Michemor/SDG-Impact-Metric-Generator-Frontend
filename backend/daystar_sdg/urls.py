"""
URL configuration for daystar_sdg project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from impact_tracker.views import (
    SDGGoalViewSet, ActivityViewSet, dashboard_summary, analytics_trends
)
from impact_tracker.reports import generate_sdg_report_pdf, generate_comprehensive_report
from django.conf import settings
from django.conf.urls.static import static

# Create API router
router = DefaultRouter()
router.register(r'sdg', SDGGoalViewSet, basename='sdg')
router.register(r'activities', ActivityViewSet, basename='activity')

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # API routes
    path('api/', include(router.urls)),
    path('api/dashboard/summary/', dashboard_summary, name='dashboard-summary'),
    path('api/analytics/trends/', analytics_trends, name='analytics-trends'),
    path('api/reports/generate/<int:sdg_id>/', generate_sdg_report_pdf, name='generate-sdg-report'),
    path('api/reports/comprehensive/', generate_comprehensive_report, name='comprehensive-report'),
    
    # Authentication
    path('api/auth/', include('rest_framework.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

