from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator


class SDGGoal(models.Model):
    """
    Sustainable Development Goal model.
    Represents the 17 UN Sustainable Development Goals.
    """
    number = models.IntegerField(
        unique=True,
        validators=[MinValueValidator(1), MaxValueValidator(17)],
        help_text="SDG number from 1 to 17"
    )
    name = models.CharField(max_length=255, help_text="Name of the SDG")
    description = models.TextField(help_text="Detailed description of the SDG")
    icon_url = models.URLField(blank=True, null=True, help_text="URL to SDG icon")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['number']
        verbose_name = "SDG Goal"
        verbose_name_plural = "SDG Goals"

    def __str__(self):
        return f"SDG {self.number}: {self.name}"


class Activity(models.Model):
    """
    Generic university output/activity that contributes to SDG goals.
    """
    ACTIVITY_TYPES = [
        ('research', 'Research'),
        ('project', 'Project'),
        ('curriculum', 'Curriculum'),
        ('outreach', 'Outreach'),
    ]

    title = models.CharField(max_length=255, help_text="Title of the activity")
    description = models.TextField(help_text="Detailed description of the activity")
    activity_type = models.CharField(
        max_length=20,
        choices=ACTIVITY_TYPES,
        help_text="Type of activity"
    )
    evidence_file = models.FileField(
        upload_to='evidence/',
        blank=True,
        null=True,
        help_text="Supporting evidence (PDF, image, etc.)"
    )
    lead_author = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        related_name='activities',
        help_text="User who uploaded/created this activity"
    )
    date_created = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    ai_classified = models.BooleanField(
        default=False,
        help_text="Whether this activity has been classified by AI"
    )

    class Meta:
        ordering = ['-date_created']
        verbose_name = "Activity"
        verbose_name_plural = "Activities"

    def __str__(self):
        return f"{self.title} ({self.get_activity_type_display()})"


class SDGImpact(models.Model):
    """
    Junction table linking Activities to SDG Goals.
    Stores the impact score and AI-generated justification.
    """
    activity = models.ForeignKey(
        Activity,
        on_delete=models.CASCADE,
        related_name='sdg_impacts',
        help_text="Related activity"
    )
    sdg_goal = models.ForeignKey(
        SDGGoal,
        on_delete=models.CASCADE,
        related_name='impacts',
        help_text="Related SDG goal"
    )
    score = models.IntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        help_text="Relevance score (0-100)"
    )
    justification = models.TextField(
        help_text="AI-generated reasoning for the impact score"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-score']
        unique_together = ('activity', 'sdg_goal')
        verbose_name = "SDG Impact"
        verbose_name_plural = "SDG Impacts"

    def __str__(self):
        return f"{self.activity.title} → SDG {self.sdg_goal.number} ({self.score}%)"


class InstitutionMetric(models.Model):
    """
    Benchmarking data for university SDG performance over time.
    """
    university_name = models.CharField(max_length=255, help_text="Name of the university")
    year = models.IntegerField(validators=[MinValueValidator(2000), MaxValueValidator(2100)])
    sdg_goal = models.ForeignKey(
        SDGGoal,
        on_delete=models.CASCADE,
        related_name='metrics',
        help_text="Related SDG goal"
    )
    score = models.FloatField(
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        help_text="Annual SDG performance score (0-100)"
    )
    total_activities = models.IntegerField(default=0, help_text="Total activities for this SDG in the year")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-year', 'sdg_goal__number']
        unique_together = ('university_name', 'year', 'sdg_goal')
        verbose_name = "Institution Metric"
        verbose_name_plural = "Institution Metrics"

    def __str__(self):
        return f"{self.university_name} - SDG {self.sdg_goal.number} ({self.year}): {self.score}%"
