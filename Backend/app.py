from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from Apis import login, liabilities_api, assets_api, expenses_api, revenues_api , cashflow_api
import os

# Create the Flask application
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Flask-Mail configuration for Gmail
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
app.config['MAIL_USERNAME'] = 'wealthwise.com.in@gmail.com'
app.config['MAIL_PASSWORD'] = 'Wealthwise@2024'
app.config['MAIL_DEFAULT_SENDER'] = 'wealthwise.com.in@gmail.com'

# Initialize Mail and login components
login.mail.init_app(app)

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

# Get Users Route
@app.route('/api/users', methods=['GET'])
def get_users():
    return login.get_users()

@app.route('/api/users/<string:userid>', methods=['GET'])
def get_user(userid):
    return login.get_user(userid)   

# Endpoint to handle password reset link
@app.route('/reset_password/<token>', methods=['GET', 'POST'])
def reset_password(token):
    return login.reset_password(token)

# Login (Authentication) Route
@app.route('/api/login', methods=['POST'])
def login_user():
    return login.authenticate_user(request)  # Pass 'request' explicitly

@app.route('/api/liabilities/add', methods=['POST'])
def add_liability():
    new_liability = request.json  # Get JSON payload from the request
    
    # Call the method from liabilities_api.py to add the new liability
    response, status_code = liabilities_api.add_new_liability(new_liability)  # Unpack response and status code
    return jsonify(response), status_code  # Return the response with the appropriate status code

@app.route('/api/liabilities/update/<string:id>', methods=['PUT'])
def update_liability(id):
    updated_data = request.get_json()
    return liabilities_api.update_liability(id, updated_data)

@app.route('/api/liabilities/delete/<string:id>', methods=['DELETE'])
def remove_liability(id):
    print(id)
    # Call the delete function from liabilities_api.py
    response, status_code = liabilities_api.remove_liability(id)
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

@app.route('/api/assets/update/<string:id>', methods=['PUT'])
def update_asset(id):
    updated_data = request.get_json()
    return assets_api.update_asset(id, updated_data)

@app.route('/api/assets/delete/<string:id>', methods=['DELETE'])
def remove_asset(id):
    # Call the delete function from assets_api.py
    response, status_code = assets_api.remove_asset(id)    
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

@app.route('/api/expenses/update/<string:id>', methods=['PUT'])
def update_expense(id):
    updated_data = request.get_json()
    return expenses_api.update_expense(id, updated_data)

@app.route('/api/expenses/delete/<string:id>', methods=['DELETE'])
def remove_expense(id):
    # Call the delete function from expenses_api.py
    response, status_code = expenses_api.remove_expense(id)
    return jsonify(response), status_code


@app.route('/api/expenses/getAll', methods=['GET'])
def fetch_all_expenses():
    # Call the function to get all assets
    response, status_code = expenses_api.get_all_expenses()
    
    return jsonify(response), status_code

@app.route('/api/expenses/filter/<string:Year>/<string:Quarter>', methods=['GET'])
def filter_expense(Year, Quarter):
    filters = {'Year': Year, 'Quarter': Quarter}
    return expenses_api.filter_expense(filters)

# Flask route for adding a new revenue record
@app.route('/api/revenues/add', methods=['POST'])
def add_revenue():
    new_revenue = request.get_json()
    return revenues_api.add_new_revenue(new_revenue)

@app.route('/api/revenues/update/<string:id>', methods=['PUT'])
def update_revenue(id):
    updated_data = request.get_json()
    return revenues_api.update_revenue(id, updated_data)

@app.route('/api/revenues/delete/<string:id', methods=['DELETE'])
def remove_revenue(id):
    # Call the delete function from revenues_api.py
    response, status_code = revenues_api.delete_revenue(id)
    
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

# Set the secret key for session management
app.secret_key = os.getenv('SECRET_KEY', 'default_dev_key')
# Define the logout route and allow POST method
@app.route('/api/logout', methods=['POST'])
def logout():
    return login.logout_user()

@app.route('/api/cashflow/add', methods=['POST'])
def add_cashflow():
    new_cashflow = request.json  # Get JSON payload from the request
    
    # Call the method from cashflow_api.py to add the new cashflow
    response, status_code = cashflow_api.add_new_cashflow(new_cashflow)  # Unpack response and status code
    return jsonify(response), status_code  # Return the response with the appropriate status code

@app.route('/api/cashflow/update/<string:id>', methods=['PUT'])
def update_cashflow(id):
    updated_data = request.get_json()
    return cashflow_api.update_cashflow(id, updated_data)

@app.route('/api/cashflow/delete/<string:id>', methods=['DELETE'])
def remove_cashflow(id):
    # Call the delete function from cashflow_api.py
    response, status_code = cashflow_api.remove_cashflow(id)    
    return jsonify(response), status_code

@app.route('/api/cashflow/getAll', methods=['GET'])
def fetch_all_cashflows():
    # Call the function to get all assets
    response, status_code = cashflow_api.get_all_cashflows()
    
    return jsonify(response), status_code

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True,port=5001)
