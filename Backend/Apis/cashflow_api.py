from flask import jsonify
from pymongo import MongoClient
import certifi, os
from bson import ObjectId
from bson.errors import InvalidId

# MongoDB Atlas connection (handled here in cashflow_api.py)
mongo_connection_string = os.getenv('MONGODB_CONNECTION_STRING')
client = MongoClient(mongo_connection_string, tlsCAFile=certifi.where())
db = client['Data']
cashflow_collection = db['Cashflow']

def add_new_cashflow(new_cashflow):
    required_fields = [
        'Year', 'Quarter', 'Amount','Type', 'Category'
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
    
def update_cashflow(id, updated_data):
    try:
        # Validate ObjectId format
        if not ObjectId.is_valid(id):
            return jsonify({'error': 'Invalid ObjectId format'}), 400
        
        # Remove '_id' field if present in updated_data to avoid conflicts during update
        updated_data.pop('_id', None)

        # Perform the update operation
        result = cashflow_collection.update_one({'_id': ObjectId(id)}, {'$set': updated_data})

        if result.matched_count == 0:
            return jsonify({'error': 'Liability not found'}), 404

        return jsonify({'message': 'Liability updated successfully'}), 200
    except InvalidId:
        return jsonify({'error': 'Invalid ObjectId'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500  
    
# Delete an 
def remove_cashflow(id):
    if not ObjectId.is_valid(id):
        return jsonify({'error': 'Invalid ObjectId format'}), 400
    try:
        result = cashflow_collection.delete_one({'_id': ObjectId(id)})
        if result.deleted_count == 1:
            return jsonify({'message': 'Liability deleted successfully'}), 200
        else:
            return jsonify({'error': 'Liability not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
# Get all revenue
def get_all_cashflows():
    cashflows = list(cashflow_collection.find())  # Fetch all cashflows
    
    # Convert ObjectId to string for each cashflow
    for cashflow in cashflows:
        cashflow['_id'] = str(cashflow['_id'])
    
    return cashflows, 200