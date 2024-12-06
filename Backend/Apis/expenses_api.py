from flask import jsonify
from pymongo import MongoClient
import certifi,os
from bson import ObjectId
from bson.errors import InvalidId

# MongoDB Atlas connection (handled here in expenses_api.py)
mongo_connection_string = os.getenv('MONGODB_CONNECTION_STRING')
client = MongoClient(mongo_connection_string, tlsCAFile=certifi.where())
db = client['Data']
expenses_collection = db['Expenses']

# Add a new expense
def add_new_expense(new_expense):
    # print(new_expense)
    required_fields = [
        'Year', 'Quarter', 'Employee Benefit Expense',
        'Cost of Equipment and software Licences', 'Finance Costs',
        'Depreciation and Amortisation Costs', 'Other Expenses',
        'Total Expenses', 'Current Tax', 'Deferred Tax','Fringe benefit tax','MAT credit entitlement', 'Total Tax Expense'
    ]
    
    for field in required_fields:
        if field not in new_expense:
            return {'error': f'Missing required field: {field}'}, 400
        
    #For checking if the year and quarter already exists
    year = new_expense['Year']
    quarter = new_expense['Quarter']
    expense = expenses_collection.find_one({'Year': year, 'Quarter': quarter})
    if expense:
        return {'error': 'Expense for this year and quarter already exists'}, 400

    try:
        result = expenses_collection.insert_one(new_expense)
        new_expense['_id'] = str(result.inserted_id)
        return new_expense, 201
    except Exception as e:
        return {'error': str(e)}, 500
    
# Update an existing expense
def update_expense(id, updated_data):
    try:
        if not ObjectId.is_valid(id):
            return {'error': 'Invalid ObjectId format'}, 400
        
        updated_data.pop('_id', None)

        result = expenses_collection.update_one({'_id': ObjectId(id)}, {'$set': updated_data})

        if result.matched_count == 0:
            return {'error': 'Expense not found'}, 404

        return {'message': 'Expense updated successfully'}, 200
    except InvalidId:
        return {'error': 'Invalid ObjectId'}, 400
    except Exception as e:
        return {'error': str(e)},

# Remove an expense
def remove_expense(id):
    if not ObjectId.is_valid(id):
        return jsonify({'error': 'Invalid ObjectId format'}), 400
    try:
        result = expenses_collection.delete_one({'_id': ObjectId(id)})
        if result.deleted_count == 1:
            return jsonify({'message': 'Liability deleted successfully'}), 200
        else:
            return jsonify({'error': 'Liability not found'}), 404
    except InvalidId:
        return jsonify({'error': 'Invalid ObjectId'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

# Get all expenses
def get_all_expenses():
    assets = list(expenses_collection.find())  # Fetch all expenses
    
    # Convert ObjectId to string for each asset
    for asset in assets:
        asset['_id'] = str(asset['_id'])
    
    return assets, 200

def filter_expense(filters):
    try:
        # Convert string values to integer
        for key in filters:
            if key in ['Year', 'Quarter']:
                filters[key] = int(filters[key])
        
        expenses = list(expenses_collection.find(filters))  # Fetch filtered expenses
        # print(expenses)
        # Convert ObjectId to string for each expense
        for expense in expenses:
            expense['_id'] = str(expense['_id'])
        
        return expenses, 200
    except Exception as e:
        return {'error': str(e)}, 500