// Global function to manage page transitions (Single Page App logic)
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active-page');
    });
    // Show the requested page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active-page');
        // Scroll the active page content to top (if it has scrollable content)
        targetPage.scrollTop = 0;
        
        // Load wardrobe when viewing clothes page
        if (pageId === 'page-view-clothes') {
            loadWardrobe();
        }
        // Load profile when viewing profile page
        if (pageId === 'page-profile') {
            loadProfile();
        }
    }
}

// Function to close the menu
function closeMenu() {
    document.getElementById('dropdown-menu').classList.remove('open');
}

// Get CSRF token from cookies
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Global object to store user data during sign up
let userData = {};
let isLoggedIn = false;

document.addEventListener('DOMContentLoaded', () => {
    // --- Initial Authentication Logic ---
    document.getElementById('show-signin').addEventListener('click', () => {
        showPage('page-signin');
    });

    document.getElementById('show-signup').addEventListener('click', () => {
        showPage('page-signup-1');
    });

    // --- Sign In Form Submission ---
    document.getElementById('signin-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target;
        const username = form.elements['username'].value;
        const password = form.elements['password'].value;

        try {
            const response = await fetch('/signin/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken'),
                },
                credentials: 'same-origin',
                body: JSON.stringify({ username, password })
            });

            const result = await response.json();
            if (result.success) {
                isLoggedIn = true;
                alert('Login successful!');
                showPage('page-home');
            } else {
                alert('Login failed: ' + result.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred during sign in.');
        }
    });

    // --- Sign Up Step 1 (Username, Age, Email, Password) ---
    document.getElementById('signup-form-1').addEventListener('submit', (e) => {
        e.preventDefault();
        const form = e.target;
        userData.username = form.elements['username'].value;
        userData.age = form.elements['age'].value;
        userData.email = form.elements['email'].value;
        userData.password = form.elements['password'].value;
        showPage('page-signup-2');
    });

    // --- Sign Up Step 2 (Personal Info) ---
    document.getElementById('signup-form-2').addEventListener('submit', (e) => {
        e.preventDefault();
        const form = e.target;
        userData.gender = form.elements['gender'].value;
        userData.location = form.elements['location'].value;
        userData.country = form.elements['country'].value;
        showPage('page-signup-3');
    });

    // --- Sign Up Step 3 (Preference) ---
    document.getElementById('signup-form-3').addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target;
        userData.preference = form.elements['preference'].value;
        
        console.log('Sign Up data:', userData);
        
        try {
            const response = await fetch('/signup/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken'),
                },
                credentials: 'same-origin',
                body: JSON.stringify(userData)
            });

            const result = await response.json();
            if (result.success) {
                alert('Sign up successful! Please sign in.');
                showPage('page-signin');
                // Reset form
                userData = {};
            } else {
                alert('Sign up failed: ' + result.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred during sign up.');
        }
    });

    // --- Home Page Menu Toggle ---
    document.getElementById('menu-toggle').addEventListener('click', () => {
        document.getElementById('dropdown-menu').classList.toggle('open');
    });
    
    // --- Vibe Options Logic (Routes to Recommendation Page) ---
    window.showSuggestion = function(vibe) {
        const titleElement = document.getElementById('recommendation-title');
        const textElement = document.getElementById('recommendation-text');
        const contextElement = document.getElementById('vibe-context');
        
        const vibeMap = {
            'office': 'Professional/Formal',
            'party': 'Evening/Celebration',
            'casual': 'Daytime Casual'
        };
        
        const vibeName = vibeMap[vibe] || 'Outfit';

        titleElement.textContent = `${vibeName} Recommendation`;
        textElement.textContent = `Here is an outfit suggested for a ${vibeName} occasion:`;
        contextElement.textContent = `Suggested for: ${vibeName}`;
        
        // In a real app, this would trigger an AI API call to fetch image/link.
        showPage('page-outfit-recommendation');
    };

    // --- Custom Vibe Submission ---
    document.getElementById('custom-vibe-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const vibeInput = e.target.elements['vibe'].value;

        const titleElement = document.getElementById('recommendation-title');
        const textElement = document.getElementById('recommendation-text');
        const contextElement = document.getElementById('vibe-context');
        
        titleElement.textContent = `Custom Vibe Recommendation`;
        textElement.textContent = `Here is an outfit based on your request: "${vibeInput}"`;
        contextElement.textContent = `Custom Vibe: ${vibeInput.substring(0, 30)}...`;

        e.target.elements['vibe'].value = ''; // Clear input
        // Route to the same recommendation page
        showPage('page-outfit-recommendation');
    });

    // --- Feedback Form Submission ---
    document.getElementById('feedback-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const feedbackText = e.target.elements['feedback'].value;

        try {
            const response = await fetch('/feedback/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken'),
                },
                credentials: 'same-origin',
                body: JSON.stringify({ text: feedbackText })
            });

            const result = await response.json();
            if (result.success) {
                alert('Thank you for your feedback!');
                e.target.reset();
                showPage('page-home');
            } else {
                alert('Failed to submit feedback: ' + result.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while submitting feedback.');
        }
    });

    // --- Add Clothes Flow ---
    window.showAddForm = function(category) {
        console.log(`Requesting permissions for adding ${category}...`);
        document.getElementById('add-item-title').textContent = `Add ${category}`;
        document.getElementById('add-item-category').textContent = category;
        document.getElementById('add-category-input').value = category;
        showPage('page-add-item');
    };

    // --- Add Clothing Form Submission ---
    document.getElementById('add-clothing-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        try {
            const response = await fetch('/wardrobe/add/', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRFToken': getCookie('csrftoken'),
                },
                credentials: 'same-origin',
            });

            const result = await response.json();
            if (result.success) {
                alert('Clothing item added successfully!');
                e.target.reset();
                showPage('page-add-clothes');
            } else {
                alert('Failed to add clothing: ' + result.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while adding clothing.');
        }
    });

    // --- Delete Clothes Flow ---
    window.showDeleteList = function(category) {
        document.getElementById('delete-item-title').textContent = `Delete ${category}`;
        document.getElementById('delete-item-category').textContent = category;
        console.log(`Loading items in category: ${category} for deletion.`);
        // TODO: Load actual items from backend
        showPage('page-delete-item');
    };

    // Add a simple delete button listener for the placeholder items
    document.getElementById('delete-item-list').addEventListener('click', async (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const itemId = e.target.dataset.itemId;
            
            if (!itemId) {
                e.target.closest('.delete-item').remove();
                alert('Item deleted.');
                return;
            }

            try {
                const response = await fetch('/wardrobe/delete/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCookie('csrftoken'),
                    },
                    credentials: 'same-origin',
                    body: JSON.stringify({ item_id: itemId })
                });

                const result = await response.json();
                if (result.success) {
                    e.target.closest('.delete-item').remove();
                    alert('Item deleted successfully!');
                } else {
                    alert('Failed to delete item: ' + result.message);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while deleting the item.');
            }
        }
    });

    // --- Sign Out ---
    window.handleSignout = async function() {
        try {
            const response = await fetch('/signout/', {
                method: 'GET',
                credentials: 'include',
            });
            
            isLoggedIn = false;
            userData = {};
            alert('You have been signed out.');
            showPage('page-auth');
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred during sign out.');
        }
    };

    // --- Load Wardrobe ---
    window.loadWardrobe = async function() {
        const container = document.getElementById('wardrobe-container');
        container.innerHTML = '<p>Loading your wardrobe...</p>';

        try {
            const response = await fetch('/wardrobe/view/', {
                method: 'GET',
                credentials: 'include',
            });

            const result = await response.json();
            if (result.success) {
                if (result.items.length === 0) {
                    container.innerHTML = '<p>Your wardrobe is empty. Add some clothes!</p>';
                } else {
                    let html = '<div class="wardrobe-grid">';
                    result.items.forEach(item => {
                        html += `
                            <div class="wardrobe-item">
                                ${item.image ? `<img src="${item.image}" alt="${item.category}">` : '<div class="no-image">No Image</div>'}
                                <p><strong>${item.category}</strong></p>
                                <p>${item.description || 'No description'}</p>
                            </div>
                        `;
                    });
                    html += '</div>';
                    container.innerHTML = html;
                }
            } else {
                container.innerHTML = '<p>Failed to load wardrobe: ' + result.message + '</p>';
            }
        } catch (error) {
            console.error('Error:', error);
            container.innerHTML = '<p>An error occurred while loading your wardrobe.</p>';
        }
    };

    // --- Load Profile ---
    window.loadProfile = async function() {
        try {
            const response = await fetch('/profile/', {
                method: 'GET',
                credentials: 'same-origin',
            });
            const result = await response.json();
            if (result.success) {
                const p = result.profile;
                document.getElementById('p-username').textContent = p.username || '';
                document.getElementById('p-age').textContent = p.age ?? '';
                document.getElementById('p-email').textContent = p.email || '';
                document.getElementById('p-gender').textContent = p.gender || '';
                document.getElementById('p-location').textContent = [p.location, p.country].filter(Boolean).join(', ');
                document.getElementById('p-preference').textContent = p.preference || '';
            } else {
                console.warn('Failed to load profile:', result.message);
            }
        } catch (error) {
            console.error('Error loading profile:', error);
        }
    };

});