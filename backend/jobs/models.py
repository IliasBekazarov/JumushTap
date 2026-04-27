from django.db import models
from users.models import User


class Job(models.Model):
    PROFILE_TYPE_CHOICES = [
        ('employer', 'Работодатель'),
        ('seeker', 'Ищу работу'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='jobs')
    description = models.TextField()
    whatsapp = models.CharField(max_length=20)
    phone = models.CharField(max_length=20)
    address = models.CharField(max_length=255)
    is_negotiable = models.BooleanField(default=False)
    salary_from = models.IntegerField(null=True, blank=True)
    salary_to = models.IntegerField(null=True, blank=True)
    profile_type = models.CharField(max_length=20, choices=PROFILE_TYPE_CHOICES, default='employer')
    active = models.BooleanField(default=True)
    views_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.user.name} - {self.description[:50]}'


class Bookmark(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookmarks')
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='bookmarked_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'job')

    def __str__(self):
        return f'{self.user.name} saved {self.job.id}'


class Rating(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ratings_given')
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='ratings')
    score = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'job')
