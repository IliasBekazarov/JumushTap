from django.urls import path
from . import views

urlpatterns = [
    path('', views.jobs_list, name='jobs-list'),
    path('<int:pk>/', views.job_detail, name='job-detail'),
    path('<int:pk>/bookmark/', views.toggle_bookmark, name='toggle-bookmark'),
    path('<int:pk>/rate/', views.rate_job, name='rate-job'),
    path('my/', views.my_jobs, name='my-jobs'),
    path('bookmarks/', views.my_bookmarks, name='my-bookmarks'),
]
