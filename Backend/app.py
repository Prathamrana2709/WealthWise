from flask import Flask, request
from Apis import login  # Import login module where MongoDB connection and logic resides

# Create the Flask application
app = Flask(__name__)



# Register User Route
@app.route('/api/register', methods=['POST'])
def register():
    return login.register_user(request)

# Update User Route
@app.route('/api/update/<userid>', methods=['PUT'])
def update_user(userid):
    return login.update_user(request, userid)

# Delete User Route
@app.route('/api/delete/<userid>', methods=['DELETE'])
def delete_user(userid):
    return login.delete_user(userid)

# Login (Authentication) Route
@app.route('/api/login', methods=['GET'])
def login_user():
    return login.authenticate_user(request)

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True,port=5001)
