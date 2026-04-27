from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from django.db.models import Q
from .models import Job, Bookmark, Rating
from .serializers import JobSerializer, JobCreateSerializer, RatingSerializer


@api_view(['GET', 'POST'])
def jobs_list(request):
    if request.method == 'GET':
        q = request.query_params.get('q', '')
        profile_type = request.query_params.get('profile_type', '')
        jobs = Job.objects.select_related('user').prefetch_related('ratings', 'bookmarked_by')
        if q:
            jobs = jobs.filter(
                Q(description__icontains=q) | Q(address__icontains=q)
            )
        if profile_type:
            jobs = jobs.filter(profile_type=profile_type)
        # Активдүү эмес вакансияларды жашыруу (owner өзү гана көрөт)
        if request.user.is_authenticated:
            jobs = jobs.filter(Q(active=True) | Q(user=request.user))
        else:
            jobs = jobs.filter(active=True)
        serializer = JobSerializer(jobs, many=True, context={'request': request})
        return Response(serializer.data)

    # POST - create job
    if not request.user.is_authenticated:
        return Response({'detail': 'Authentication required'}, status=401)
    serializer = JobCreateSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        job = serializer.save()
        return Response(JobSerializer(job, context={'request': request}).data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
def job_detail(request, pk):
    try:
        job = Job.objects.select_related('user').prefetch_related('ratings', 'bookmarked_by').get(pk=pk)
    except Job.DoesNotExist:
        return Response({'detail': 'Not found'}, status=404)

    if request.method == 'GET':
        job.views_count += 1
        job.save(update_fields=['views_count'])
        return Response(JobSerializer(job, context={'request': request}).data)

    if not request.user.is_authenticated or job.user != request.user:
        return Response({'detail': 'Forbidden'}, status=403)

    if request.method == 'PUT':
        serializer = JobCreateSerializer(job, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(JobSerializer(job, context={'request': request}).data)
        return Response(serializer.errors, status=400)

    if request.method == 'PATCH':
        # active toggle үчүн (же башка жеке талааларды жаңыртуу)
        serializer = JobCreateSerializer(job, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
        else:
            # active сыяктуу JobCreateSerializer'де жок талааларды түздөн-түз сактоо
            for field, value in request.data.items():
                if hasattr(job, field):
                    setattr(job, field, value)
            job.save()
        return Response(JobSerializer(job, context={'request': request}).data)

    job.delete()
    return Response(status=204)


@api_view(['POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def toggle_bookmark(request, pk):
    try:
        job = Job.objects.get(pk=pk)
    except Job.DoesNotExist:
        return Response({'detail': 'Not found'}, status=404)

    bookmark, created = Bookmark.objects.get_or_create(user=request.user, job=job)
    if not created:
        bookmark.delete()
        return Response({'bookmarked': False})
    return Response({'bookmarked': True})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_bookmarks(request):
    bookmarks = Bookmark.objects.filter(user=request.user).select_related('job__user')
    jobs = [b.job for b in bookmarks]
    serializer = JobSerializer(jobs, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_jobs(request):
    jobs = Job.objects.filter(user=request.user).prefetch_related('ratings', 'bookmarked_by')
    serializer = JobSerializer(jobs, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def rate_job(request, pk):
    try:
        job = Job.objects.get(pk=pk)
    except Job.DoesNotExist:
        return Response({'detail': 'Not found'}, status=404)
    serializer = RatingSerializer(data=request.data, context={'request': request, 'job': job})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)
