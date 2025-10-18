from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from .models import UserProfile, WardrobeItem, Feedback
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_POST
from django.contrib.auth.decorators import login_required
import json

@require_POST
def signup(request):
    data = json.loads(request.body)
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    age = data.get("age")
    gender = data.get("gender")
    location = data.get("location")
    country = data.get("country")
    preference = data.get("preference")

    if not username or not password:
        return JsonResponse({"success": False, "message": "Username and password are required."})

    if User.objects.filter(username=username).exists():
        return JsonResponse({"success": False, "message": "Username already exists."})

    user = User.objects.create_user(username, email, password)
    UserProfile.objects.create(
        user=user,
        age=age or 0,
        gender=gender or "",
        location=location or "",
        country=country or "",
        preference=preference or ""
    )
    
    return JsonResponse({"success": True, "message": "User created successfully."})

@require_POST
def signin(request):
    data = json.loads(request.body)
    username = data.get("username")
    password = data.get("password")
    user = authenticate(request, username=username, password=password)

    if user:
        login(request, user)
        return JsonResponse({"success": True, "message": "Login successful."})
    else:
        return JsonResponse({"success": False, "message": "Invalid credentials."})

def signout(request):
    logout(request)
    return redirect('/')

@login_required
@require_POST
def add_clothing(request):
    # Handle both form data and file uploads
    category = request.POST.get("category")
    description = request.POST.get("description", "")
    image = request.FILES.get("image")

    if not category:
        return JsonResponse({"success": False, "message": "Category is required."})

    try:
        user_profile = UserProfile.objects.get(user=request.user)
        WardrobeItem.objects.create(
            user_profile=user_profile, 
            category=category, 
            description=description, 
            image=image
        )
        return JsonResponse({"success": True, "message": "Clothing item added."})
    except UserProfile.DoesNotExist:
        return JsonResponse({"success": False, "message": "User profile not found."})
    except Exception as e:
        return JsonResponse({"success": False, "message": str(e)})

@login_required
@require_POST
def delete_clothing(request):
    data = json.loads(request.body)
    item_id = data.get("item_id")
    try:
        item = WardrobeItem.objects.get(id=item_id, user_profile__user=request.user)
        item.delete()
        return JsonResponse({"success": True, "message": "Clothing item deleted."})
    except WardrobeItem.DoesNotExist:
        return JsonResponse({"success": False, "message": "Item not found."})

@login_required
@require_POST
def feedback(request):
    data = json.loads(request.body)
    feedback_text = data.get("text")

    if not feedback_text:
        return JsonResponse({"success": False, "message": "Feedback text is required."})

    user_profile = UserProfile.objects.get(user=request.user)
    Feedback.objects.create(user_profile=user_profile, text=feedback_text)

    return JsonResponse({"success": True, "message": "Feedback received."})

@login_required
def view_wardrobe(request):
    if request.user.is_authenticated:
        try:
            user_profile = UserProfile.objects.get(user=request.user)
            items = WardrobeItem.objects.filter(user_profile=user_profile)
            wardrobe_data = []
            for item in items:
                wardrobe_data.append({
                    'id': item.id,
                    'category': item.category,
                    'description': item.description,
                    'image': item.image.url if item.image else None
                })
            return JsonResponse({'success': True, 'items': wardrobe_data})
        except UserProfile.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'User profile not found.'})
    return JsonResponse({'success': False, 'message': 'Unauthorized.'})

@login_required
def profile(request):
    try:
        user_profile = UserProfile.objects.get(user=request.user)
        data = {
            "username": request.user.username,
            "email": request.user.email,
            "age": user_profile.age,
            "gender": user_profile.gender,
            "location": user_profile.location,
            "country": user_profile.country,
            "preference": user_profile.preference,
        }
        return JsonResponse({"success": True, "profile": data})
    except UserProfile.DoesNotExist:
        return JsonResponse({"success": False, "message": "User profile not found."})

@ensure_csrf_cookie
def home(request):
    return render(request, "stylesense/index.html")
