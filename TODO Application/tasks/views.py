from django.shortcuts import get_object_or_404, redirect
from django.urls import reverse_lazy
from django.views import generic
from django.utils import timezone
from django.db.models import Count, Q
from django.http import JsonResponse
from datetime import timedelta, date
import json

from .models import Task
from .forms import TaskForm


class TaskListView(generic.ListView):
    model = Task
    template_name = 'tasks/task_list.html'
    paginate_by = 20

    def get_queryset(self):
        qs = Task.objects.filter(deleted=False).order_by('-created_at')
        status = self.request.GET.get('status')
        if status == 'pending':
            qs = qs.filter(status=Task.STATUS_PENDING)
        elif status == 'resolved':
            qs = qs.filter(status=Task.STATUS_RESOLVED)
        elif status == 'overdue':
            qs = qs.filter(status=Task.STATUS_PENDING, due_date__lt=date.today())

        sort = self.request.GET.get('sort')
        if sort == 'due':
            qs = qs.order_by('due_date')
        elif sort == 'priority':
            qs = qs.order_by('-priority')
        return qs


class TaskDetailView(generic.DetailView):
    model = Task
    template_name = 'tasks/task_detail.html'


class TaskCreateView(generic.CreateView):
    model = Task
    form_class = TaskForm
    template_name = 'tasks/task_form.html'
    success_url = reverse_lazy('tasks:task_list')


class TaskUpdateView(generic.UpdateView):
    model = Task
    form_class = TaskForm
    template_name = 'tasks/task_form.html'
    success_url = reverse_lazy('tasks:task_list')


class TaskDeleteView(generic.DeleteView):
    model = Task
    template_name = 'tasks/task_confirm_delete.html'
    success_url = reverse_lazy('tasks:task_list')

    def delete(self, request, *args, **kwargs):
        # Soft delete
        task = self.get_object()
        task.soft_delete()
        return redirect(self.success_url)


def mark_resolved(request, pk):
    task = get_object_or_404(Task, pk=pk)
    task.mark_resolved()
    return redirect('tasks:task_detail', pk=pk)


class DashboardView(generic.TemplateView):
    template_name = 'tasks/dashboard.html'

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        today = date.today()

        # Weekly: last 7 days
        week_start = today - timedelta(days=6)
        tasks_created_week = Task.objects.filter(created_at__date__gte=week_start, deleted=False).count()
        tasks_resolved_week = Task.objects.filter(resolved_at__date__gte=week_start, deleted=False).count()
        overdue_week = Task.objects.filter(due_date__lt=today, status=Task.STATUS_PENDING, deleted=False).count()
        completion_rate = 0
        if tasks_created_week > 0:
            completion_rate = round((tasks_resolved_week / tasks_created_week) * 100, 1)

        # tasks by day for last 7 days
        tasks_by_day = []
        labels = []
        for i in range(7):
            d = week_start + timedelta(days=i)
            labels.append(d.strftime('%a'))
            created = Task.objects.filter(created_at__date=d, deleted=False).count()
            tasks_by_day.append(created)

        # Priority distribution (pie)
        priorities = Task.objects.filter(deleted=False).values('priority').annotate(count=Count('id'))
        priority_labels = [p['priority'] for p in priorities]
        priority_counts = [p['count'] for p in priorities]

        ctx.update({
            'tasks_created_week': tasks_created_week,
            'tasks_resolved_week': tasks_resolved_week,
            'overdue_week': overdue_week,
            'completion_rate': completion_rate,
            'tasks_by_day_labels': json.dumps(labels),
            'tasks_by_day_data': json.dumps(tasks_by_day),
            'priority_labels': json.dumps(priority_labels),
            'priority_counts': json.dumps(priority_counts),
        })
        return ctx
