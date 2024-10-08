from flask import jsonify
from pymongo import MongoClient
import certifi

# MongoDB Atlas connection (handled here in assets_api.py)
client = MongoClient("mongodb+srv://chandrgupt553:8iVT4sFaeFTxDbsK@wealthwise.mtgwn.mongodb.net/", tlsCAFile=certifi.where())
db = client['Data']
assets_collection = db['Assets']

# Add a new assets
def add_new_asset(new_asset):
    # Ensure all required fields are present
    required_fields = ['Year', 'Quarter', 'Amount', 'Type', 'Category']
    for field in required_fields:
        if field not in new_asset:
            return {'error': f'Missing required field: {field}'}, 400

    try:
        # Insert the assets into the MongoDB collection
        result = assets_collection.insert_one(new_asset)

        # Return the inserted asset with the ObjectId as a string
        new_asset['_id'] = str(result.inserted_id)
        return new_asset, 201  # Success, created status
    except Exception as e:
        return {'error': str(e)}, 500  # Internal server error
    
# Update an existing assets using the original year and quarter as search keys
def update_existing_asset(original_year, original_quarter, updated_data):
    # Remove any fields from updated_data that are not provided (i.e., partial update)
    update_fields = {key: value for key, value in updated_data.items() if value is not None}
    
    if not update_fields:
        return {'error': 'No fields to update'}, 400

    # Search for the asset using the original year and quarter
    search_criteria = {'year': original_year, 'quarter': original_quarter}

    # Update the asset with the provided data
    result = assets_collection.update_one(search_criteria, {'$set': update_fields})

    if result.matched_count == 1:
        # Retrieve the updated document (note: use updated year/quarter if they were changed)
        # If year/quarter were updated, use them for the fetch, otherwise use the original values
        updated_year = updated_data.get('year', original_year)
        updated_quarter = updated_data.get('quarter', original_quarter)

        updated_asset = assets_collection.find_one({'year': updated_year, 'quarter': updated_quarter})
        updated_asset['_id'] = str(updated_asset['_id'])  # Convert ObjectId to string
        
        return updated_asset, 200  # Return the updated asset and status code
    else:
        return {'error': 'Asset not found for the given year and quarter'}, 404

# Delete an existing asset using year and quarter
def delete_asset(year, quarter):
    # Find and delete the asset matching the year and quarter
    result = assets_collection.delete_one({'year': year, 'quarter': quarter})
    
    if result.deleted_count == 1:
        return {'message': f'Liability for year {year} and quarter {quarter} deleted successfully'}, 200
    else:
        return {'error': 'Liability not found for the given year and quarter'}, 404
    
# Get all asset
def get_all_assets():
    assets = list(assets_collection.find())  # Fetch all asset
    
    # Convert ObjectId to string for each asset
    for asset in assets:
        asset['_id'] = str(asset['_id'])
    
    return assets, 200
    
# Get assets based on filter criteria
def filter_assets(filters):
    query = {}
    
    # Dynamically build the query based on provided filters
    if 'Year' in filters:
        query['Year'] = filters['Year']
    if 'Quarter' in filters:
        query['Quarter'] = filters['Quarter']
    if 'Type' in filters:
        query['Type'] = filters['Type']
    if 'category' in filters:
        query['Category'] = filters['Category']
    
    assets = list(assets_collection.find(query))
    
    # Convert ObjectId to string for each liability
    for asset in assets:
        asset['_id'] = str(asset['_id'])
    
    return assets, 200




