from rest_framework import serializers
from .models import Job, Bookmark, Rating
from users.models import User


class JobUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'avatar']


class JobSerializer(serializers.ModelSerializer):
    user = JobUserSerializer(read_only=True)
    avg_rating = serializers.SerializerMethodField()
    is_bookmarked = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = [
            'id', 'user', 'description', 'whatsapp', 'phone',
            'address', 'is_negotiable', 'salary_from', 'salary_to',
            'profile_type', 'active', 'views_count', 'avg_rating', 'is_bookmarked',
            'created_at', 'expires_at'
        ]

    def get_avg_rating(self, obj):
        ratings = obj.ratings.all()
        if not ratings:
            return 0
        return round(sum(r.score for r in ratings) / len(ratings), 1)

    def get_is_bookmarked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.bookmarked_by.filter(user=request.user).exists()
        return False


class JobCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = [
            'description', 'whatsapp', 'phone', 'address',
            'is_negotiable', 'salary_from', 'salary_to',
            'profile_type', 'active', 'expires_at'
        ]

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = ['id', 'score', 'created_at']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        validated_data['job'] = self.context['job']
        rating, created = Rating.objects.update_or_create(
            user=validated_data['user'],
            job=validated_data['job'],
            defaults={'score': validated_data['score']}
        )
        return rating
