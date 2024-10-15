from flask import jsonify, request
from pymongo import MongoClient
import certifi,os

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
            "password": data['password'],  # For simplicity, no password hashing here
            "role": data.get('role', 'user')  # Optional role field, default is 'user'
        }
        users_collection.insert_one(new_user)
        return jsonify({"message": "User registered successfully!"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Method to update a user by Email-id
def update_user(request, Emailid):
    try:
        data = request.json

        update_fields = {}
        if 'password' in data:
            update_fields['password'] = data['password']

        if 'role' in data:
            update_fields['role'] = data['role']

        if not update_fields:
            return jsonify({"error": "No valid fields to update"}), 400

        result = users_collection.update_one(
            {"Email_id": Emailid},
            {"$set": update_fields}
        )

        if result.matched_count > 0:
            return jsonify({"message": f"User {Emailid} updated successfully!"}), 200
        else:
            return jsonify({"error": "User not found!"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Method to delete a user by userid
def delete_user(Emailid):
    try:
        result = users_collection.delete_one({"Email_id": Emailid})

        if result.deleted_count > 0:
            return jsonify({"message": f"User {Emailid} deleted successfully!"}), 200
        else:
            return jsonify({"error": "User not found!"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Method to authenticate a user (login)
def authenticate_user():
    try:
        data = request.get_json()  # Get JSON data from the request body
        Email_id = data.get('Email_id')
        password = data.get('password')

        if not Email_id or not password:
            return jsonify({"error": "Both 'Email_id' and 'password' are required"}), 400

        user = users_collection.find_one({"Email_id": Email_id})

        if user and user['password'] == password:
            return jsonify({"message": "Authentication successful!", "Email_id": Email_id, "role": user['role']}), 200
        else:
            return jsonify({"error": "Invalid Email_id or password"}), 401

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Method to authenticate a user (login)
def authenticate_user(request):
    try:
        Emailid = request.args.get('Email_id')
        password = request.args.get('password')

        if not Emailid or not password:
            return jsonify({"error": "Both 'Email_id' and 'password' are required"}), 400

        user = users_collection.find_one({"Email_id": Emailid})

        if user and user['password'] == password:
             # Return success message along with the userid and role
            return jsonify({
                "message": "Authentication successful!",
                "Email_id": Emailid,
                "role": user['role']  # Return the role as part of the response
            }), 200
        else:
            return jsonify({"error": "Invalid userid or password"}), 401

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