from django.urls import path
from . import views

urlpatterns = [
    path('signup/', views.signup, name='signup'),
    path('signin/', views.signin, name='signin'),
    path('signout/', views.signout, name='signout'),
    path('profile/', views.profile, name='profile'),
    path('wardrobe/add/', views.add_clothing, name='add_clothing'),
    path('wardrobe/delete/', views.delete_clothing, name='delete_clothing'),
    path('wardrobe/view/', views.view_wardrobe, name='view_wardrobe'),
    path('feedback/', views.feedback, name='feedback'),
    path('', views.home, name='home'),
]
