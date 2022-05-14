from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Account

class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ['id', 'first_name', 'phone_number', 'address']

class AccountSerializerWithJwt(AccountSerializer):
    token = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Account
        fields = '__all__'

    def get_token(self, obj):
        token = RefreshToken.for_user(obj)
        token['email'] = obj.email
        token['password'] = obj.password
        return str(token.access_token)