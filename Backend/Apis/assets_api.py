from flask import jsonify
from pymongo import MongoClient
import certifi

# MongoDB Atlas connection
client = MongoClient("mongodb+srv://chandrgupt553:8iVT4sFaeFTxDbsK@wealthwise.mtgwn.mongodb.net/", tlsCAFile=certifi.where())
db = client['Data']
assets_collection = db['Assets']

def add_new_asset(new_asset):
    required_fields = ['Year', 'Quarter', 'Amount', 'Type', 'Category']
    for field in required_fields:
        if field not in new_asset:
            return {'error': f'Missing required field: {field}'}, 400

    try:
        result = assets_collection.insert_one(new_asset)
        new_asset['_id'] = str(result.inserted_id)
        return new_asset, 201  # Created
    except Exception as e:
        return {'error': str(e)}, 500  # Internal server error

def update_existing_asset(original_year, original_quarter, updated_data):
    update_fields = {key: value for key, value in updated_data.items() if value is not None}
    
    if not update_fields:
        return {'error': 'No fields to update'}, 400

    search_criteria = {'Year': original_year, 'Quarter': original_quarter}

    result = assets_collection.update_one(search_criteria, {'$set': update_fields})

    if result.matched_count == 1:
        updated_asset = assets_collection.find_one(search_criteria)
        updated_asset['_id'] = str(updated_asset['_id'])
        return updated_asset, 200  # Updated
    else:
        return {'error': 'Asset not found for the given year and quarter'}, 404

def delete_asset(year, quarter):
    result = assets_collection.delete_one({'Year': year, 'Quarter': quarter})
    
    if result.deleted_count == 1:
        return {'message': f'Asset for year {year} and quarter {quarter} deleted successfully'}, 200
    else:
        return {'error': 'Asset not found for the given year and quarter'}, 404
    
def get_all_assets():
    assets = list(assets_collection.find())
    
    for asset in assets:
        asset['_id'] = str(asset['_id'])
    
    return assets, 200

def filter_assets(filters):
    query = {}
    
    if 'Year' in filters:
        query['Year'] = filters['Year']
    
    assets = list(assets_collection.find(query))
    
    for asset in assets:
        asset['_id'] = str(asset['_id'])
    
    return assets, 200
