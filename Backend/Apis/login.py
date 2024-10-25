from flask import jsonify, request, Flask, url_for, render_template, redirect
from pymongo import MongoClient
import certifi, os
from flask_mail import Mail, Message
from itsdangerous import URLSafeTimedSerializer
import bcrypt

app = Flask(__name__)

# Mail and token configuration
s = URLSafeTimedSerializer('YourSecretKey')
mail = Mail()

# MongoDB Atlas connection (handled here in login.py)
mongo_connection_string = os.getenv('MONGODB_CONNECTION_STRING')
client = MongoClient(mongo_connection_string, tlsCAFile=certifi.where())
db = client['UserAuth']
users_collection = db['Users']

# Method to register a user
def register_user(request):
    try:
        data = request.json
        if 'Email_id' not in data or 'password' not in data:
            return jsonify({"error": "Both 'Email-id' and 'password' are required"}), 400

        existing_user = users_collection.find_one({"Email_id": data['Email_id']})
        if existing_user:
            return jsonify({"error": "User already exists"}), 400

        new_user = {
            "Email_id": data['Email_id'],
            "Name": data['Name'],
            "password": data['password'],  # For simplicity, no password hashing here
            "role": data.get('role', 'user')  # Optional role field, default is 'user'
        }
        users_collection.insert_one(new_user)
        return jsonify({"message": "User registered successfully!"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Method to update a user by Email-id
def update_user(request, userid):
    try:
        data = request.json
        print("Received update data:", data)  # Debugging line

        update_fields = {}
        if 'password' in data:
            update_fields['password'] = data['password']

        if 'role' in data:
            update_fields['role'] = data['role']

        if 'Name' in data:
            update_fields['Name'] = data['Name']

        if not update_fields:
            return jsonify({"error": "No valid fields to update"}), 400

        print("Update fields:", update_fields)  # Debugging line

        result = users_collection.update_one(
            {"Email_id": userid},  
            {"$set": update_fields}
        )

        if result.matched_count > 0:
            return jsonify({"message": f"User {userid} updated successfully!"}), 200
        else:
            return jsonify({"error": "User not found!"}), 404

    except Exception as e:
        print("Error occurred:", str(e))  # Debugging line
        return jsonify({"error": str(e)}), 500

# Method to delete a user by userid
def delete_user(Emailid):
    try:
        # Find the user to check their role
        user = users_collection.find_one({"Email_id": Emailid})

        if user is None:
            return jsonify({"error": "User not found!"}), 404

        # Check if the user has the HR role
        if user.get("role") == "HR":
            return jsonify({"error": "User with HR role cannot be deleted!"}), 403

        # Proceed to delete the user if not HR
        result = users_collection.delete_one({"Email_id": Emailid})

        if result.deleted_count > 0:
            return jsonify({"message": f"User {Emailid} deleted successfully!"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Method to authenticate a user
def authenticate_user(request):
    try:
        data = request.get_json()  # Get JSON data from the request body
        Emailid = data.get('Email_id')  # Extract 'Email_id' from the JSON payload
        password = data.get('password')  # Extract 'password' from the JSON payload
        
        if not Emailid or not password:
            return jsonify({"error": "Both 'Email_id' and 'password' are required"}), 400

        # Find user by Email_id in the database
        user = users_collection.find_one({"Email_id": Emailid})

        if user and user['password'] == password:
            # Return success message along with the Email_id and role
            return jsonify({
                "message": "Authentication successful!",
                "Email_id": Emailid,
                "role": user['role'],  # Return the role as part of the response
                "name": user['Name']
            }), 200
        else:
            return jsonify({"error": "Invalid Email_id or password"}), 401

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    
# Logout function
def logout_user():
    try:
        # Here you can handle session invalidation or token revocation logic
        # Assuming you are using token-based authentication (like JWT)
        return jsonify({"message": "Logout successful!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# Get all users

def get_users():
    try:
        users = users_collection.find({})
        user_list = [{"Email_id": user["Email_id"], "Name": user["Name"], "role": user["role"]} for user in users]
        return jsonify({"users": user_list})

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# Get a user by Email_id
def get_user(Emailid):
    try:
        user = users_collection.find_one({"Email_id": Emailid})
        if user:
            return jsonify({"Name": user["Name"], "role": user["role"]})
        else:
            return jsonify({"error": "User not found!"}), 404
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
def register():
    data = request.get_json()
    email = data['Email_id']
    name = data['Name']
    role = data['role']
    
    # Create a temporary password and hash it
    temp_password = bcrypt.hashpw(b'TemporaryPassword123', bcrypt.gensalt())
    
    # Save the user details in the database (here it's a dummy dictionary)
    users_collection[email] = {
        'name': name,
        'role': role,
        'password': temp_password,  # Store hashed temp password
    }
    
    # Generate token for the password reset link
    token = s.dumps(email, salt='password-reset-salt')
    reset_link = url_for('reset_password', token=token, _external=True)
    
    # Send email with the reset link
    send_reset_email(email, reset_link, role)
    
    return jsonify({'message': f'User {name} registered successfully, email sent with password reset link.'})

# Function to send email
def send_reset_email(email, reset_link, role):
    msg = Message('Set Your Password for WealthWise', recipients=[email])
    msg.body = f'''
    Hello,

    Please click the link below to set your password for the WealthWise system:
    {reset_link}

    Your role: {role}
    
    Note: The link will expire in 60 minutes.
    '''
    mail.send(msg)

# Endpoint to handle password reset link
def reset_password(token):
    try:
        email = s.loads(token, salt='password-reset-salt', max_age=3600)  # Token valid for 1 hour
    except:
        return jsonify({'message': 'The reset link is invalid or has expired.'}), 400
    
    if request.method == 'POST':
        data = request.get_json()
        new_password = data['password']
        
        # Hash the new password
        hashed_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())
        
        # Update user's password in the database
        if email in users_collection:
            users_collection[email]['password'] = hashed_password
            return jsonify({'message': 'Password updated successfully.'})
        else:
            return jsonify({'message': 'User not found.'}), 404
        
    # If GET request, return a password reset form (for demonstration)
    return '''
        <form method="POST">
            <label>Enter New Password:</label>
            <input type="password" name="password" required>
            <button type="submit">Reset Password</button>
        </form>
    '''