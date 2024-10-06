from flask import Flask, request, jsonify
from pymongo import MongoClient
import certifi
from werkzeug.security import generate_password_hash

# Create a Flask application
app = Flask(__name__)

# MongoDB Atlas connection string (replace <username>, <password> with your credentials)
client = MongoClient("mongodb+srv://chandrgupt553:8iVT4sFaeFTxDbsK@wealthwise.mtgwn.mongodb.net/", tlsCAFile=certifi.where())

# Use the 'UserAuth' database
db = client['UserAuth']

# Use the 'Users' collection
users_collection = db['Users']

# Route to register a new user (POST)
@app.route('/register', methods=['POST'])
def register_user():
    try:
        # Get JSON data from the request
        data = request.json

        # Ensure both 'userid' and 'password' are provided
        if 'userid' not in data or 'password' not in data:
            return jsonify({"error": "Both 'userid' and 'password' are required"}), 400

        # Check if user already exists
        existing_user = users_collection.find_one({"userid": data['userid']})
        if existing_user:
            return jsonify({"error": "User already exists"}), 400


        # Create the new user document
        new_user = {
            "userid": data['userid'],
            "password": data['password'],
            "role":data['role']
        }

        # Insert the user into the MongoDB collection
        users_collection.insert_one(new_user)

        # Return success response
        return jsonify({"message": "User registered successfully!"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    # Route to update a user's password by userid (PUT)
@app.route('/update/<userid>', methods=['PUT'])
def update_user(userid):
    try:
        data = request.json

        # Check if there's something to update
        if not data:
            return jsonify({"error": "No data provided"}), 400

        update_fields = {}

        # If password is provided, add it to the update fields (in plain text)
        if 'password' in data:
            update_fields['password'] = data['password']

        # If role is provided, add it to the update fields
        if 'role' in data:
            update_fields['role'] = data['role']

        # If no valid fields to update are provided
        if not update_fields:
            return jsonify({"error": "No valid fields to update"}), 400

        # Update the user in MongoDB
        result = users_collection.update_one(
            {"userid": userid},  # Match user by userid
            {"$set": update_fields}  # Set the fields to update
        )

        # Check if the user was found and updated
        if result.matched_count > 0:
            return jsonify({"message": f"User {userid} updated successfully!"}), 200
        else:
            return jsonify({"error": "User not found!"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500



    # Route to delete a user by userid (DELETE)
@app.route('/delete/<userid>', methods=['DELETE'])
def delete_user(userid):
    try:
        # Try to delete the user by 'userid'
        result = users_collection.delete_one({"userid": userid})

        # Check if the user was found and deleted
        if result.deleted_count > 0:
            return jsonify({"message": f"User {userid} deleted successfully!"}), 200
        else:
            return jsonify({"error": "User not found!"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# Authentication route (GET)
@app.route('/login', methods=['GET'])
def authenticate_user():
    try:
        userid = request.args.get('userid')
        password = request.args.get('password')

        if not userid or not password:
            return jsonify({"error": "Both 'userid' and 'password' are required"}), 400

        user = users_collection.find_one({"userid": userid})

        if user and user['password'] == password:
            return jsonify({"message": "Authentication successful!", "userid": userid,"role": user['role']}), 200
        else:
            return jsonify({"error": "Invalid userid or password"}), 401

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
