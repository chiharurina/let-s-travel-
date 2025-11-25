import os
import logging                                  # For logging requests
from flask      import Flask, jsonify, request, make_response  # request gets JSON data from POST method, jsonify returns JSON responses, flask for routing
from supabase   import create_client, Client
from dotenv     import load_dotenv
from flask_cors import CORS                     # Cross Origin Resource Sharing to allow requests from different origins 

# Load environment variables to protect url & key
load_dotenv()

# Getting URL and Key from .env
url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")

# Initialize Supabase client
supabase: Client = create_client(url, key)

# Initialize Flask
app = Flask(__name__)

app.config.update(
    SESSION_COOKIE_SAMESITE="None",   # Needed when frontend is on a different port/domain
    SESSION_COOKIE_SECURE=False,      # True in production under HTTPS
)

CORS(app,
     supports_credentials=True,                         # Allow cookie/auth credentials
     origins=["http://localhost:5173"],                 # Frontend access
     methods=["GET", "POST", "OPTIONS"],                # Methods
     allow_headers=["Content-Type", "Authorization"]    # JSON and Auth headers
)  # Enable CORS for all routes

# Cookie Functions 
ACCESS_COOKIE_NAME  = "access_token"
REFRESH_COOKIE_NAME = "refresh_token"

def set_auth_cookies(response, access_token, refresh_token):
    # Attach access & refresh tokens as HttpOnly cookies.
    # Rough lifetimes – in a real app, you'd sync these with token exp.
    access_max_age  = 60 * 60          # 1 hour
    refresh_max_age = 60 * 60 * 24*30  # 30 days

    cookie_kwargs = {
        "httponly": True,
        "samesite": "None",    # because frontend is on a different origin (5173)
        "secure": False,       # MUST be True in production with HTTPS
        "path": "/",
    }

    response.set_cookie(
        ACCESS_COOKIE_NAME,
        access_token,
        max_age=access_max_age,
        **cookie_kwargs,
    )
    response.set_cookie(
        REFRESH_COOKIE_NAME,
        refresh_token,
        max_age=refresh_max_age,
        **cookie_kwargs,
    )
    return response


def clear_auth_cookies(response):
    """
    Remove auth cookies on logout.
    """
    response.set_cookie(ACCESS_COOKIE_NAME,  "", max_age=0, path="/")
    response.set_cookie(REFRESH_COOKIE_NAME, "", max_age=0, path="/")
    return response

# Authentication Routes

# Register Route
@app.route("/api/auth/register", methods=["POST"])
def register():
    data        =   request.get_json()      # Get JSON data from request
    email       =   data.get("email")       # Get email from JSON
    password    =   data.get("password")    # Get password from JSON
    try:
        #Register using email and password (Using Supabase Authenticaton)
        user = supabase.auth.sign_up({"email": email, "password": password})

        #Returns the JSON response with user ID and email
        return jsonify({
            "message"   :   "Registration successful",
            "user_id"   :   user.user.id,
            "email"     :   user.user.email
        })
    except Exception as e:
        return jsonify({"error": f"Registration Failed: {str(e)}"}), 400 # Return 400 Bad Request on error

# Login Route
@app.route("/api/auth/login", methods=["POST"])
def login():
    data        =   request.get_json()      # Get JSON data from request
    email       =   data.get("email")       # Get email from JSON
    password    =   data.get("password")    # Get password from JSON
    try:
        #Login using email and password (Using Supabase Authentication)
        session = supabase.auth.sign_in_with_password({"email": email, "password": password})
        if not session.session:
            return jsonify({"error": "Invalid credentials"}), 401 # Return 401 Unauthorized on invalid credentials
        
        access_token  = session.session.access_token
        refresh_token = session.session.refresh_token

        # Returns response with access token (proves user is authenticated for the session) (Usually lasts 1-2 Hours)
        # Refresh token used for future logins (Usually lasts for weeks or months)
        resp = make_response(jsonify({
            "message": "Login successful"
        }))
        # Attach cookies (HttpOnly)
        set_auth_cookies(resp, access_token, refresh_token)
        return resp
    except Exception as e:
        return jsonify({"error": f"Login Failed: {str(e)}"}) , 400          # Return 400 Bad Request on error

# Logout Route
@app.route("/api/auth/logout", methods=["POST"])
def logout():
    try:
        supabase.auth.sign_out()
        resp = make_response(jsonify({"message": "Logout Successful"})) 
        clear_auth_cookies(resp)    # Clear auth cookies
        return resp                 # Return response
    except Exception as e:
        return jsonify({"error": f"Logout Failed: {str(e)}"}), 400          # Return 400 Bad Request on error

# Get Current User Route
@app.route("/api/auth/me", methods=["GET"])
def me():
    token   =   request.headers.get("Authorization")
    # Strip "Bearer " prefix to prevent issues
    if token.startswith("Bearer "):
        token = token.split(" ", 1)[1]
    # Go to cookies if not in header
    if not token:
        token = request.cookies.get(ACCESS_COOKIE_NAME)
    # If still not found, return error
    if not token:
        return jsonify({"error": "Authorization token is missing"}), 401    # Return 401 Unauthorized if token is missing
    try:
        user    =   supabase.auth.get_user(token)
        if not user.user:
            return jsonify({"error": "Invalid token"}), 401                 # Return 401 Unauthorized if token is invalid
        return jsonify({
            "id"    :   user.user.id,
            "email" :   user.user.email
        })
    except Exception as e:
        return jsonify({"error": f"Failed to fetch user: {str(e)}"}), 400   # Return 400 Bad Request on error

# Allow token refresh
@app.route("/api/auth/refresh", methods=["POST"])
def refresh():
    refresh_token   =   request.cookies.get(REFRESH_COOKIE_NAME)   # Extract refresh token from cookie instead of JSON
    if not refresh_token:
        return jsonify({"error": "Refresh token is missing"}), 400          # Return 400 Bad Request if token is missing
    try:
        session = supabase.auth.refresh_session(refresh_token)
        if not session.session:
            return jsonify({"error": "Refresh failed"}), 401
        new_access  = session.session.access_token
        new_refresh = session.session.refresh_token
        resp = make_response(jsonify({
            "message": "Token refresh successful"
        }))
        set_auth_cookies(resp, new_access, new_refresh)
        return resp
    except Exception as e:
        return jsonify({"error": f"Token refresh failed: {str(e)}"}), 400   # Return 400 Bad Request on error

# Set up logging 
@app.after_request
def log_request(response):
    if request.path.startswith("/api/auth/"):
        logging.info(f"{request.method} {request.path} - Status: {response.status_code}")
    return response

# Run the Flask app
if __name__ == "__main__": # Checks if the script is run directly (not imported as a module)
    # If file is run directly, start the Flask development server with debug mode enabled
    app.run(debug=True)


# Reminders/Notes:
"""
Return dictionaries, they are key-value pairs, which map directly to JSON objects.
JSON is the standard format for data exchange in web APIs.

Use appropriate HTTP status codes for error handling (e.g., 400 for Bad Request, 401 for Unauthorized).
    -200: Success
    -400: Bad Request (invalid input)
    -401: Unauthorized (missing or invalid token)
    -403: Forbidden (valid token, but not allowed)

Log auth events.
"""
