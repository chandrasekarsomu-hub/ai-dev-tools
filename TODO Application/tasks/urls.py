from django.urls import path
from . import views

app_name = 'tasks'

urlpatterns = [
    path('', views.TaskListView.as_view(), name='task_list'),
    path('task/add/', views.TaskCreateView.as_view(), name='task_add'),
    path('task/<int:pk>/', views.TaskDetailView.as_view(), name='task_detail'),
    path('task/<int:pk>/edit/', views.TaskUpdateView.as_view(), name='task_edit'),
    path('task/<int:pk>/delete/', views.TaskDeleteView.as_view(), name='task_delete'),
    path('task/<int:pk>/resolve/', views.mark_resolved, name='task_resolve'),
    path('dashboard/', views.DashboardView.as_view(), name='dashboard'),
]
