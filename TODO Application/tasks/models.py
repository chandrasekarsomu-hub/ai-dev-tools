from django.db import models


class Task(models.Model):
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]

    STATUS_PENDING = 'pending'
    STATUS_RESOLVED = 'resolved'
    STATUS_CHOICES = [
        (STATUS_PENDING, 'Pending'),
        (STATUS_RESOLVED, 'Resolved'),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    due_date = models.DateField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default=STATUS_PENDING)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    deleted = models.BooleanField(default=False)

    def mark_resolved(self):
        from django.utils import timezone

        if self.status != self.STATUS_RESOLVED:
            self.status = self.STATUS_RESOLVED
            self.resolved_at = timezone.now()
            self.save()

    def soft_delete(self):
        self.deleted = True
        self.save()

    def __str__(self):
        return f"{self.title} ({self.status})"

    def get_absolute_url(self):
        from django.urls import reverse
        return reverse('tasks:task_detail', args=[str(self.id)])
