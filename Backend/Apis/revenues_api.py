from flask import jsonify
from pymongo import MongoClient
import certifi

# MongoDB Atlas connection (handled here in revenue_api.py)
client = MongoClient("mongodb+srv://chandrgupt553:8iVT4sFaeFTxDbsK@wealthwise.mtgwn.mongodb.net/", tlsCAFile=certifi.where())
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
    

# Update an existing revenue using the original year and quarter as search keys
def update_existing_revenue(original_year, original_quarter, updated_data):
    # Remove any fields from updated_data that are not provided (i.e., partial update)
    update_fields = {key: value for key, value in updated_data.items() if value is not None}
    
    if not update_fields:
        return {'error': 'No fields to update'}, 400

    # Search for the revenue using the original year and quarter
    search_criteria = {'Year': original_year, 'Quarter': original_quarter}

    # Update the asset with the provided data
    result = revenue_collection.update_one(search_criteria, {'$set': update_fields})

    if result.matched_count == 1:
        # Retrieve the updated document (note: use updated year/quarter if they were changed)
        # If year/quarter were updated, use them for the fetch, otherwise use the original values
        updated_year = updated_data.get('Year', original_year)
        updated_quarter = updated_data.get('Quarter', original_quarter)

        updated_revenue = revenue_collection.find_one({'Year': updated_year, 'Quarter': updated_quarter})
        updated_revenue['_id'] = str(updated_revenue['_id'])  # Convert ObjectId to string
        
        return updated_revenue, 200  # Return the updated revenue and status code
    else:
        return {'error': 'Revenue not found for the given year and quarter'}, 404
    
# Delete an existing revenue using year and quarter
def delete_revenue(year, quarter):
    # Find and delete the revenue matching the year and quarter
    result = revenue_collection.delete_one({'Year': year, 'Quarter': quarter})
    
    if result.deleted_count == 1:
        return {'message': f'Revenue for year {year} and quarter {quarter} deleted successfully'}, 200
    else:
        return {'error': 'Revenue not found for the given year and quarter'}, 404
    
# Get all liabilities
def get_all_revenues():
    revenues = list(revenue_collection.find())  # Fetch all liabilities
    
    # Convert ObjectId to string for each liability
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

