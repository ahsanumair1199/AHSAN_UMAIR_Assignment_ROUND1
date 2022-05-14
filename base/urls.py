from django.urls import path
from . import views

urlpatterns = [
    path('users/login/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path("users/profile/", views.getUserProfile, name="userProfile"),
    path('users/register/', views.registerUser, name="registerUser"),
    path('csvfile/', views.readFileData, name="readFileData"),
]