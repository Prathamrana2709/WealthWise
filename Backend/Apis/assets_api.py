from flask import jsonify
from pymongo import MongoClient
import certifi,os
from bson import ObjectId
from bson.errors import InvalidId

# MongoDB Atlas connection
mongo_connection_string = os.getenv('MONGODB_CONNECTION_STRING')
client = MongoClient(mongo_connection_string, tlsCAFile=certifi.where())
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

def update_asset(id, updated_data):
    try:
        if not ObjectId.is_valid(id):
            return {'error': 'Invalid ObjectId format'}, 400
        
        updated_data.pop('_id', None)

        result = assets_collection.update_one({'_id': ObjectId(id)}, {'$set': updated_data})

        if result.matched_count == 0:
            return {'error': 'Asset not found'}, 404

        return {'message': 'Asset updated successfully'}, 200
    except InvalidId:
        return {'error': 'Invalid ObjectId'}, 400
    except Exception as e:
        return {'error': str(e)}, 500
    
def remove_asset(id):
    if not ObjectId.is_valid(id):
        return {'error': 'Invalid ObjectId format'}, 400
    try:
        result = assets_collection.delete_one({'_id': ObjectId(id)})
        if result.deleted_count == 1:
            return {'message': 'Asset deleted successfully'}, 200
        else:
            return {'error': 'Asset not found'}, 404
    except Exception as e:
        return {'error': str(e)}, 500  

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
