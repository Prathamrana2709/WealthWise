from flask import jsonify
from pymongo import MongoClient
import certifi,os
from bson import ObjectId


# MongoDB Atlas connection (handled here in revenue_api.py)
mongo_connection_string = os.getenv('MONGODB_CONNECTION_STRING')
client = MongoClient(mongo_connection_string, tlsCAFile=certifi.where())
db = client['Data']
revenue_collection = db['Revenues']

# Add a new revenue record
def add_new_revenue(new_revenue):
    # Ensure all required fields are present
    required_fields = ['Year', 'Quarter', 'Revenue from operations', 'Other Income', 'Total Revenue', 
                       'Cost of Revenue', 'Gross Margin', 'SG&A Expense', 'Operating Income', 
                       'Expenditure', 'Other Expense', 'Income Before Income Tax', 'Income Taxes', 
                       'Income After Income Tax', 'Non controlling Interest', 'Net Income', 
                       'Net Cash as % of Net Income', 'Net Cash', 'Earnings per share', 'Total Assets', 
                       'Total Liabilities', 'Total Expenditure', 'Budget']
    
    for field in required_fields:
        if field not in new_revenue:
            return {'error': f'Missing required field: {field}'}, 400

    try:
        # Insert the revenue into the MongoDB collection
        result = revenue_collection.insert_one(new_revenue)
        new_revenue['_id'] = str(result.inserted_id)  # Convert ObjectId to string
        return new_revenue, 201  # Success, created status
    except Exception as e:
        return {'error': str(e)}, 500  # Internal server error
    
# Update an existing revenue record
def update_revenue(id, updated_data):
    try:
        # Validate ObjectId format
        if not ObjectId.is_valid(id):
            return {'error': 'Invalid ObjectId format'}, 400
        
        # Remove '_id' field if present in updated_data to avoid conflicts during update
        updated_data.pop('_id', None)

        # Perform the update operation
        result = revenue_collection.update_one({'_id': ObjectId(id)}, {'$set': updated_data})

        if result.matched_count == 0:
            return {'error': 'Revenue not found'}, 404

        return {'message': 'Revenue updated successfully'}, 200
    except Exception as e:
        return {'error': str(e)}, 500
    
# Delete a revenue record
def remove_revenue(id):
    if not ObjectId.is_valid(id):
        return {'error': 'Invalid ObjectId format'}, 400
    try:
        result = revenue_collection.delete_one({'_id': ObjectId(id)})
        if result.deleted_count == 1:
            return {'message': 'Revenue deleted successfully'}, 200
        else:
            return {'error': 'Revenue not found'}, 404
    except Exception as e:
        return {'error': str(e)}, 500
    
# Get all revenue
def get_all_revenues():
    revenues = list(revenue_collection.find())  # Fetch all revenue
    
    # Convert ObjectId to string for each revenue
    for revenue in revenues:
        revenue['_id'] = str(revenue['_id'])
    
    return revenues, 200

# Get revenues based on filter criteria    
def filter_revenues(filters):
    query = {}
    
    if 'Year' in filters:
        query['Year'] = filters['Year']

    revenues = list(revenue_collection.find(query))

    for revenue in revenues:
        revenue['_id'] = str(revenue['_id'])
    
    return revenues, 200

