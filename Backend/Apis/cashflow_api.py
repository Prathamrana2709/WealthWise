from flask import jsonify
from pymongo import MongoClient
import certifi, os

# MongoDB Atlas connection (handled here in cashflow_api.py)
mongo_connection_string = os.getenv('MONGODB_CONNECTION_STRING')
client = MongoClient(mongo_connection_string, tlsCAFile=certifi.where())
db = client['Data']
cashflow_collection = db['Cashflow']

def add_new_cashflow(new_cashflow):
    required_fields = [
        'Year', 'Quarter', 'Amount','Type', 'Category', 'In/Out'
    ]
    
    for field in required_fields:
        if field not in new_cashflow:
            return {'error': f'Missing required field: {field}'}, 400

    try:
        result = cashflow_collection.insert_one(new_cashflow)
        new_cashflow['_id'] = str(result.inserted_id)
        return new_cashflow, 201
    except Exception as e:
        return {'error': str(e)}, 500
    
def update_existing_cashflow(original_year, original_quarter, updated_data):
    # Remove any fields from updated_data that are not provided (i.e., partial update)
    update_fields = {key: value for key, value in updated_data.items() if value is not None}
    
    if not update_fields:
        return {'error': 'No fields to update'}, 400

    # Search for the cashflow using the original year and quarter
    search_criteria = {'Year': original_year, 'Quarter': original_quarter}

    # Update the asset with the provided data
    result = cashflow_collection.update_one(search_criteria, {'$set': update_fields})

    if result.matched_count == 1:
        # Retrieve the updated document (note: use updated year/quarter if they were changed)
        # If year/quarter were updated, use them for the fetch, otherwise use the original values
        updated_year = updated_data.get('Year', original_year)
        updated_quarter = updated_data.get('Quarter', original_quarter)

        updated_cashflow = cashflow_collection.find_one({'Year': updated_year, 'Quarter': updated_quarter})
        updated_cashflow['_id'] = str(updated_cashflow['_id'])  # Convert ObjectId to string
        
        return updated_cashflow, 200  # Return the updated cashflow and status code
    else:
        return {'error': 'Cashflow not found for the given year and quarter'}, 404
    
# Delete an existing revenue using year and quarter
def delete_cashflow(year, quarter):
    # Find and delete the revenue matching the year and quarter
    result = cashflow_collection.delete_one({'Year': year, 'Quarter': quarter})
    
    if result.deleted_count == 1:
        return {'message': f'Cashflow for year {year} and quarter {quarter} deleted successfully'}, 200
    else:
        return {'error': 'Cashflow not found for the given year and quarter'}, 404
    
# Get all revenue
def get_all_cashflows():
    cashflows = list(cashflow_collection.find())  # Fetch all cashflows
    
    # Convert ObjectId to string for each cashflow
    for cashflow in cashflows:
        cashflow['_id'] = str(cashflow['_id'])
    
    return cashflows, 200