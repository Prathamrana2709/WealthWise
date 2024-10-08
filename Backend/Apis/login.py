from flask import jsonify
from pymongo import MongoClient
import certifi

# MongoDB Atlas connection (handled here in login.py)
client = MongoClient("mongodb+srv://chandrgupt553:8iVT4sFaeFTxDbsK@wealthwise.mtgwn.mongodb.net/", tlsCAFile=certifi.where())
db = client['UserAuth']
users_collection = db['Users']


# Method to register a user
def register_user(request):
    try:
        data = request.json
        if 'userid' not in data or 'password' not in data:
            return jsonify({"error": "Both 'userid' and 'password' are required"}), 400

        existing_user = users_collection.find_one({"userid": data['userid']})
        if existing_user:
            return jsonify({"error": "User already exists"}), 400

        new_user = {
            "userid": data['userid'],
            "password": data['password'],  # For simplicity, no password hashing here
            "role": data.get('role', 'user')  # Optional role field, default is 'user'
        }
        users_collection.insert_one(new_user)
        return jsonify({"message": "User registered successfully!"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Method to update a user by userid
def update_user(request, userid):
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
            {"userid": userid},
            {"$set": update_fields}
        )

        if result.matched_count > 0:
            return jsonify({"message": f"User {userid} updated successfully!"}), 200
        else:
            return jsonify({"error": "User not found!"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Method to delete a user by userid
def delete_user(userid):
    try:
        result = users_collection.delete_one({"userid": userid})

        if result.deleted_count > 0:
            return jsonify({"message": f"User {userid} deleted successfully!"}), 200
        else:
            return jsonify({"error": "User not found!"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Method to authenticate a user (login)
def authenticate_user(request):
    try:
        userid = request.args.get('userid')
        password = request.args.get('password')

        if not userid or not password:
            return jsonify({"error": "Both 'userid' and 'password' are required"}), 400

        user = users_collection.find_one({"userid": userid})

        if user and user['password'] == password:
            return jsonify({"message": "Authentication successful!", "userid": userid, "role": user['role']}), 200
        else:
            return jsonify({"error": "Invalid userid or password"}), 401

    except Exception as e:
        return jsonify({"error": str(e)}), 500


