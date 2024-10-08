from flask import jsonify
from pymongo import MongoClient
import certifi

# MongoDB Atlas connection (handled here in liabilities_api.py)
client = MongoClient("mongodb+srv://chandrgupt553:8iVT4sFaeFTxDbsK@wealthwise.mtgwn.mongodb.net/", tlsCAFile=certifi.where())
db = client['Data']
expenses_collection = db['Expenses']

# Add a new expense
def add_new_expense(new_expense):
    required_fields = [
        'Year', 'Quarter', 'Employee Benefit Expense',
        'Cost of Equipment and software Licences', 'Finance Costs',
        'Depreciation and Amortisation Costs', 'Other Expenses',
        'Total Expenses', 'Current Tax', 'Deferred Tax','Fringe benefit tax','MAT credit entitlement', 'Total Tax Expense'
    ]
    
    for field in required_fields:
        if field not in new_expense:
            return {'error': f'Missing required field: {field}'}, 400

    try:
        result = expenses_collection.insert_one(new_expense)
        new_expense['_id'] = str(result.inserted_id)
        return new_expense, 201
    except Exception as e:
        return {'error': str(e)}, 500
    
# Update an existing expenses using the original year and quarter as search keys
def update_existing_expenses(original_year, original_quarter, updated_data):
    # Remove any fields from updated_data that are not provided (i.e., partial update)
    update_fields = {key: value for key, value in updated_data.items() if value is not None}
    
    if not update_fields:
        return {'error': 'No fields to update'}, 400

    # Search for the asset using the original year and quarter
    search_criteria = {'year': original_year, 'quarter': original_quarter}

    # Update the asset with the provided data
    result = expenses_collection.update_one(search_criteria, {'$set': update_fields})

    if result.matched_count == 1:
        # Retrieve the updated document (note: use updated year/quarter if they were changed)
        # If year/quarter were updated, use them for the fetch, otherwise use the original values
        updated_year = updated_data.get('year', original_year)
        updated_quarter = updated_data.get('quarter', original_quarter)

        updated_expens = expenses_collection.find_one({'year': updated_year, 'quarter': updated_quarter})
        updated_expens['_id'] = str(updated_expens['_id'])  # Convert ObjectId to string
        
        return updated_expens, 200  # Return the updated asset and status code
    else:
        return {'error': 'Asset not found for the given year and quarter'}, 404
    
# Delete an existing expense using year and quarter
def delete_expense(year, quarter):
    # Find and delete the expense matching the year and quarter
    result = expenses_collection.delete_one({'year': year, 'quarter': quarter})
    
    if result.deleted_count == 1:
        return {'message': f'Expense for year {year} and quarter {quarter} deleted successfully'}, 200
    else:
        return {'error': 'Expense not found for the given year and quarter'}, 404

# Get all expenses
def get_all_expenses():
    assets = list(expenses_collection.find())  # Fetch all expenses
    
    # Convert ObjectId to string for each asset
    for asset in assets:
        asset['_id'] = str(asset['_id'])
    
    return assets, 200

def filter_expenses(filters):
    query = {}
    
    if 'Year' in filters:
        query['Year'] = filters['Year']

    expenses = list(expenses_collection.find(query))

    for expense in expenses:
        expense['_id'] = str(expense['_id'])
    
    return expenses, 200

