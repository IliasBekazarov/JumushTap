from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User


class RegisterSerializer(serializers.Serializer):
    phone = serializers.CharField(max_length=20)
    name = serializers.CharField(max_length=100)

    def validate_phone(self, value):
        if User.objects.filter(phone=value).exists():
            raise serializers.ValidationError("Bu telefon nomeri allaqachon royxatdan otgan")
        return value

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class LoginSerializer(serializers.Serializer):
    phone = serializers.CharField(max_length=20)

    def validate(self, attrs):
        phone = attrs.get('phone')
        try:
            user = User.objects.get(phone=phone)
        except User.DoesNotExist:
            raise serializers.ValidationError("Bunday foydalanuvchi topilmadi")
        attrs['user'] = user
        return attrs


class UserSerializer(serializers.ModelSerializer):
    jobs_count = serializers.SerializerMethodField()
    bookmarks_count = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'phone', 'name', 'avatar', 'jobs_count', 'bookmarks_count', 'created_at']

    def get_jobs_count(self, obj):
        return obj.jobs.count()

    def get_bookmarks_count(self, obj):
        return obj.bookmarks.count()


class UpdateProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['name', 'phone', 'avatar']
