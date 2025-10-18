from django.contrib import admin
from .models import UserProfile, WardrobeItem, Feedback

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'age', 'gender', 'location', 'country', 'preference')
    search_fields = ('user__username', 'location', 'country')
    list_filter = ('gender', 'preference', 'country')

@admin.register(WardrobeItem)
class WardrobeItemAdmin(admin.ModelAdmin):
    list_display = ('user_profile', 'category', 'description')
    search_fields = ('user_profile__user__username', 'category', 'description')
    list_filter = ('category',)

@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ('user_profile', 'text', 'submitted_at')
    search_fields = ('user_profile__user__username', 'text')
    list_filter = ('submitted_at',)
    readonly_fields = ('submitted_at',)

