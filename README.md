# StyleSense - AI-Powered Fashion Recommendation System

A Django-based web application that helps users manage their wardrobe and get personalized outfit recommendations.

## Features

- **User Authentication**: Sign up and sign in functionality
- **Wardrobe Management**: Add, view, and delete clothing items with images
- **Outfit Recommendations**: Get suggestions based on occasions (office, party, casual, custom)
- **User Profiles**: Store user preferences and information
- **Feedback System**: Users can provide feedback to improve the system
- **Donation Feature**: Contact system for donating clothes

## Prerequisites

- Python 3.8 or higher
- pip (Python package installer)

## Installation

1. **Navigate to the project directory:**
   ```bash
   cd "c:\Users\Lenovo\Desktop\college notes\5th sem\Mini project\StyleSense_code\myproject"
   ```

2. **Install required packages:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run database migrations:**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

4. **Create a superuser (for admin access):**
   ```bash
   python manage.py createsuperuser
   ```
   Follow the prompts to create an admin account.

5. **Run the development server:**
   ```bash
   python manage.py runserver
   ```

6. **Access the application:**
   - Main application: http://127.0.0.1:8000/
   - Admin panel: http://127.0.0.1:8000/admin/

## Project Structure

```
myproject/
├── manage.py                 # Django management script
├── db.sqlite3               # SQLite database
├── requirements.txt         # Python dependencies
├── media/                   # User uploaded images
├── myproject/              # Main project settings
│   ├── settings.py         # Django settings
│   ├── urls.py            # Main URL configuration
│   └── wsgi.py            # WSGI configuration
└── stylesense/            # Main application
    ├── models.py          # Database models
    ├── views.py           # View functions
    ├── urls.py            # App URL patterns
    ├── admin.py           # Admin configuration
    ├── static/            # Static files
    │   └── stylesense/
    │       ├── style.css  # Stylesheets
    │       └── script.js  # JavaScript
    ├── templates/         # HTML templates
    │   └── stylesense/
    │       └── index.html # Main template
    └── migrations/        # Database migrations
```

## Usage

### For Regular Users:

1. **Sign Up**: Create a new account with your details
2. **Sign In**: Log in with your credentials
3. **Add Clothes**: Upload pictures of your clothing items by category
4. **View Wardrobe**: Browse all your stored clothing items
5. **Get Recommendations**: Select an occasion to get outfit suggestions
6. **Provide Feedback**: Share your experience to help improve the system

### For Administrators:

1. Access the admin panel at http://127.0.0.1:8000/admin/
2. Log in with superuser credentials
3. Manage users, wardrobe items, and feedback

## API Endpoints

- `GET /` - Home page
- `POST /signup/` - User registration
- `POST /signin/` - User login
- `GET /signout/` - User logout
- `POST /wardrobe/add/` - Add clothing item
- `GET /wardrobe/view/` - View wardrobe items
- `POST /wardrobe/delete/` - Delete clothing item
- `POST /feedback/` - Submit feedback

## Models

### UserProfile
- user (OneToOne with Django User)
- age
- gender
- location
- country
- preference

### WardrobeItem
- user_profile (ForeignKey)
- category
- description
- image

### Feedback
- user_profile (ForeignKey)
- text
- submitted_at

## Troubleshooting

**Issue: Static files not loading**
- Run: `python manage.py collectstatic`

**Issue: Image upload not working**
- Ensure the `media/` directory exists and has write permissions
- Check that `MEDIA_ROOT` and `MEDIA_URL` are properly configured in settings

**Issue: Database errors**
- Delete `db.sqlite3` and run migrations again
- Ensure all migrations are applied: `python manage.py migrate`

## Future Enhancements

- AI-powered outfit recommendations using machine learning
- Weather-based suggestions
- Social sharing features
- Shopping integration
- Advanced filtering and search

## Contact

For questions or support, contact: stylesenseai@gmail.com

## License

This is a mini project for educational purposes.
