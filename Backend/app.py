from flask import Flask, request, jsonify
from Apis import login  # Import login module where MongoDB connection and logic resides
from Apis import liabilities_api

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

@app.route('/api/add/liabilities', methods=['POST'])
def add_liability():
    new_liability = request.json  # Get JSON payload from the request
    
    # Call the method from liabilities_api.py to add the new liability
    response, status_code = liabilities_api.add_new_liability(new_liability)  # Unpack response and status code
    return jsonify(response), status_code  # Return the response with the appropriate status code

@app.route('/api/liabilities/update/<int:year>/<string:quarter>', methods=['PUT'])
def update_liability(year, quarter):
    updated_data = request.json  # Get the updated data from the request body
    
    # Call the function from liabilities_api.py to update the liability
    response, status_code = liabilities_api.update_existing_liability(year, quarter, updated_data)
    
    return jsonify(response), status_code

@app.route('/api/liabilities/delete/<int:year>/<string:quarter>', methods=['DELETE'])
def remove_liability(year, quarter):
    # Call the delete function from liabilities_api.py
    response, status_code = liabilities_api.delete_liability(year, quarter)
    
    return jsonify(response), status_code

@app.route('/api/liabilities/get/<int:year>/<string:quarter>', methods=['GET'])
def retrieve_liability(year, quarter):
    # Call the get function from liabilities_api.py
    response, status_code = liabilities_api.get_liability(year, quarter)
    
    return jsonify(response), status_code



# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True,port=5001)
