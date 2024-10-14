from flask import Flask, request, jsonify
from Apis import login, liabilities_api, assets_api, expenses_api
from flask_cors import CORS
from Apis import login, liabilities_api, assets_api, expenses_api, revenues_api
import os

# Create the Flask application
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

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
@app.route('/api/login', methods=['POST'])
def login_user():
    return login.authenticate_user()

@app.route('/api/liabilities/add', methods=['POST'])
def add_liability():
    new_liability = request.json  # Get JSON payload from the request
    
    # Call the method from liabilities_api.py to add the new liability
    response, status_code = liabilities_api.add_new_liability(new_liability)  # Unpack response and status code
    return jsonify(response), status_code  # Return the response with the appropriate status code

@app.route('/api/liabilities/update/<string:original_year>/<int:original_quarter>', methods=['PUT'])
def update_liability(year, quarter):
    updated_data = request.json  # Get the updated data from the request body
    
    # Call the function from liabilities_api.py to update the liability
    response, status_code = liabilities_api.update_existing_liability(year, quarter, updated_data)
    
    return jsonify(response), status_code

@app.route('/api/liabilities/delete/<string:year>/<int:quarter>', methods=['DELETE'])
def remove_liability(year, quarter):
    # Call the delete function from liabilities_api.py
    response, status_code = liabilities_api.delete_liability(year, quarter)
    
    return jsonify(response), status_code

@app.route('/api/liabilities/getAll', methods=['GET', 'OPTIONS'])
def fetch_all_liabilities():
    if request.method == 'OPTIONS':
        # Handle preflight request here
        return jsonify({"message": "CORS preflight success"}), 200
    # Call the function to get all liabilities
    response, status_code = liabilities_api.get_all_liabilities()
    return jsonify(response), status_code


@app.route('/api/liabilities/get/<string:year>', methods=['GET'])
def retrieve_liability(year):
    # Call the get function from liabilities_api.py
    response, status_code = liabilities_api.get_liability(year)
    
    return jsonify(response), status_code

@app.route('/api/liabilities/filter', methods=['GET'])
def fetch_filtered_liabilities():
    # Extract query parameters from the request
    filters = request.args.to_dict()

    # Call the filter function to get the filtered liabilities
    response, status_code = liabilities_api.filter_liabilities(filters)
    
    return jsonify(response), status_code

@app.route('/api/assets/add', methods=['POST'])
def add_asset():
    new_asset = request.json  # Get JSON payload from the request
    
    # Call the method from assets_api.py to add the new liability
    response, status_code = assets_api.add_new_asset(new_asset)  # Unpack response and status code
    return jsonify(response), status_code  # Return the response with the appropriate status code

@app.route('/api/assets/update/<string:year>/<int:quarter>', methods=['PUT'])
def update_asset(year, quarter):
    updated_data = request.json  # Get the updated data from the request body
    
    # Call the function from assets_api.py to update the asset
    response, status_code = assets_api.update_existing_asset(year, quarter, updated_data)
    
    return jsonify(response), status_code

@app.route('/api/assets/delete/<string:year>/<int:quarter>', methods=['DELETE'])
def remove_asset(year, quarter):
    # Call the delete function from assets_api.py
    response, status_code = assets_api.delete_asset(year, quarter)
    
    return jsonify(response), status_code

@app.route('/api/assets/getAll', methods=['GET'])
def fetch_all_assets():
    # Call the function to get all assets
    response, status_code = assets_api.get_all_assets()
    
    return jsonify(response), status_code

@app.route('/api/assets/get/<string:year>/<int:quarter>', methods=['GET'])
def retrieve_asset(year, quarter):
    # Call the get function from assets_api.py
    response, status_code = assets_api.get_asset(year, quarter)
    
    return jsonify(response), status_code

@app.route('/api/assets/filter', methods=['GET'])
def fetch_filtered_assets():
    # Extract query parameters from the request
    filters = request.args.to_dict()

    # Call the filter function to get the filtered assets
    response, status_code = assets_api.filter_assets(filters)
    
    return jsonify(response), status_code

@app.route('/api/expenses/add', methods=['POST'])
def create_expense():
    new_expense = request.get_json()
    return expenses_api.add_new_expense(new_expense)

@app.route('/api/expenses/update/<string:original_year>/<int:original_quarter>', methods=['PUT'])
def update_expenses(original_year, original_quarter):
    updated_data = request.get_json()
    return expenses_api.update_existing_expenses(original_year, original_quarter, updated_data)



@app.route('/api/expenses/delete/<string:year>/<int:quarter>', methods=['DELETE'])
def remove_expense(year, quarter):
    # Call the delete function from expenses_api.py
    response, status_code = expenses_api.delete_expense(year, quarter)
    
    return jsonify(response), status_code



@app.route('/api/expenses/getAll', methods=['GET'])
def fetch_all_expenses():
    # Call the function to get all assets
    response, status_code = expenses_api.get_all_expenses()
    
    return jsonify(response), status_code

@app.route('/api/expenses/filter', methods=['GET'])
def filter_expense():
    filters = request.args
    return expenses_api.filter_expenses(filters)

# Flask route for adding a new revenue record
@app.route('/api/revenues/add', methods=['POST'])
def add_revenue():
    new_revenue = request.get_json()
    return revenues_api.add_new_revenue(new_revenue)

@app.route('/api/revenues/update/<string:original_year>/<int:original_quarter>', methods=['PUT'])
def update_revenue(original_year, original_quarter):
    updated_data = request.get_json()
    return revenues_api.update_existing_revenue(original_year, original_quarter, updated_data)

@app.route('/api/revenues/delete/<string:year>/<int:quarter>', methods=['DELETE'])
def remove_revenues(year, quarter):
    # Call the delete function from expenses_api.py
    response, status_code = revenues_api.delete_revenue(year, quarter)
    
    return jsonify(response), status_code

@app.route('/api/revenues/getAll', methods=['GET'])
def fetch_all_revenues():
    # Call the function to get all assets
    response, status_code = revenues_api.get_all_revenues()
    
    return jsonify(response), status_code

@app.route('/api/revenues/filter', methods=['GET'])
def filter_revenue():
    filters = request.args
    return revenues_api.filter_revenues(filters)

# Set the secret key for session management (use a securely generated key)
app.secret_key = '9bc74018332a5fc0a00ccc10e41a293601e64a444c6c83097ee59b1aedd97311'

# Optionally, allow overriding the secret key via environment variable in production
# Replace 'SECRET_KEY' with a better name for the environment variable
app.secret_key = os.environ.get('SECRET_KEY', '9bc74018332a5fc0a00ccc10e41a293601e64a444c6c83097ee59b1aedd97311')
# Define the logout route and allow POST method
@app.route('/api/logout', methods=['POST'])
def logout():
    return login.logout_user()


# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True,port=5001)
