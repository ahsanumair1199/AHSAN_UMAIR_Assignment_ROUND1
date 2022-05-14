from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenVerifySerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.backends import TokenBackend
from .models import Account
from django.contrib.auth.models import User
from rest_framework import status
from django.contrib.auth.hashers import make_password
from django.http import HttpResponse, HttpResponseNotFound
from .serializers import AccountSerializerWithJwt
from django.views import View
import os

# fetch user data after login using post request
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, Account):
        token = super().get_token(Account)
        token['email'] = Account.email
        token['password'] = Account.password
        return token
    def validate(self, attrs):
        data = super().validate(attrs)
        refresh = self.get_token(self.user)
        data['token'] = str(refresh.access_token)
        data['user_id'] = self.user.id
        data['email'] = self.user.email
        data['first_name'] = self.user.first_name
        data['last_name'] = self.user.last_name
        data['phone_number'] = self.user.phone_number
        data['address'] = self.user.address
        data['password'] = self.user.password
        return data

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer



# get user profile details
@api_view(['POST'])
def getUserProfile(request):
    #serializer = AccountSerializer(user, many=False)
    return Response("Hello")


# in case of registering new user with JWT token, uncomment the following code
@api_view(['POST'])
def registerUser(request):
    data = request.data
    try:
        user = Account.objects.create(
            first_name = data['first_name'],
            last_name = data['last_name'],
            username = data['username'],
            email = data['email'],
            password = make_password(data['password']),
            phone_number = data['phone_number'],
            address = data['address']
        )
        serializer = AccountSerializerWithJwt(user, many=False)
        return Response(serializer.data)
    except:
        message = {
            'details': 'Email already Exist',
        }
        return Response(message, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def readFileData(request):
    filename = request.FILES['file']
    file_data = filename.read().decode('utf-8')
    lines = file_data.split("\n")
    return Response(lines)