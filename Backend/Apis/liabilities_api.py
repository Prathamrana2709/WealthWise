from flask import jsonify, request
from pymongo import MongoClient
import certifi,os
from bson import ObjectId
from bson.errors import InvalidId

# MongoDB Atlas connection (handled here in liabilities_api.py)
mongo_connection_string = os.getenv('MONGODB_CONNECTION_STRING')
client = MongoClient(mongo_connection_string, tlsCAFile=certifi.where())
db = client['Data']
liabilities_collection = db['Liabilities']

# Add a new liability
def add_new_liability(new_liability):
    # Ensure all required fields are present
    required_fields = ['Year', 'Quarter', 'Amount', 'Type', 'Category']
    for field in required_fields:
        if field not in new_liability:
            return {'error': f'Missing required field: {field}'}, 400

    try:
        # Insert the liability into the MongoDB collection
        result = liabilities_collection.insert_one(new_liability)

        # Return the inserted liability with the ObjectId as a string
        new_liability['_id'] = str(result.inserted_id)
        return new_liability, 201  # Success, created status
    except Exception as e:
        return {'error': str(e)}, 500  # Internal server error
    
def update_liability(id, updated_data):
    try:
        # Validate ObjectId format
        if not ObjectId.is_valid(id):
            return jsonify({'error': 'Invalid ObjectId format'}), 400
        
        # Remove '_id' field if present in updated_data to avoid conflicts during update
        updated_data.pop('_id', None)

        # Perform the update operation
        result = liabilities_collection.update_one({'_id': ObjectId(id)}, {'$set': updated_data})

        if result.matched_count == 0:
            return jsonify({'error': 'Liability not found'}), 404

        return jsonify({'message': 'Liability updated successfully'}), 200
    except InvalidId:
        return jsonify({'error': 'Invalid ObjectId'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500  
          
def remove_liability(id):
    print(id)
    if not ObjectId.is_valid(id):
        return jsonify({'error': 'Invalid ObjectId format'}), 400
    try:
        result = liabilities_collection.delete_one({'_id': ObjectId(id)})
        if result.deleted_count == 1:
            return jsonify({'message': 'Liability deleted successfully'}), 200
        else:
            return jsonify({'error': 'Liability not found'}), 404
    except InvalidId:
        return jsonify({'error': 'Invalid ObjectId'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
# Update an existing liability using the original year and quarter as search keys
# def update_existing_liability(original_year, original_quarter, updated_data):
#     print(original_year, original_quarter, updated_data)
#     # Remove any fields from updated_data that are not provided (i.e., partial update)
#     update_fields = {key: value for key, value in updated_data.items() if value is not None}
    
#     if not update_fields:
#         return {'error': 'No fields to update'}, 400

#     # Search for the liability using the original year and quarter
#     search_criteria = {'Year': original_year, 'Quarter': original_quarter}

#     # Update the liability with the provided data
#     result = liabilities_collection.update_one(search_criteria, {'$set': update_fields})

#     if result.matched_count == 1:
#         # Retrieve the updated document (note: use updated year/quarter if they were changed)
#         # If year/quarter were updated, use them for the fetch, otherwise use the original values
#         updated_year = updated_data.get('Year', original_year)
#         updated_quarter = updated_data.get('Quarter', original_quarter)

#         updated_liability = liabilities_collection.find_one({'Year': updated_year, 'Quarter': updated_quarter})
#         updated_liability['_id'] = str(updated_liability['_id'])  # Convert ObjectId to string
#         updated_liability['Amount'] = updated_data['Amount']  # Rename 'Amount' to 'amount'
#         updated_liability['Category'] = updated_data['Category']  # Rename 'Category' to 'category'
#         # updated_liability['Type'] = updated_liability['Type']  # Rename 'Type' to 'type'
        
#         return updated_liability, 200  # Return the updated liability and status code
#     else:
#         return {'error': 'Liability not found for the given year and quarter'}, 404

# Delete an existing liability using year and quarter
def delete_liability(year, quarter):
    # Find and delete the liability matching the year and quarter
    result = liabilities_collection.delete_one({'Year': year, 'Quarter': quarter})
    
    if result.deleted_count == 1:
        return {'message': f'Liability for year {year} and quarter {quarter} deleted successfully'}, 200
    else:
        return {'error': 'Liability not found for the given year and quarter'}, 404
    
# Get all liabilities
def get_all_liabilities():
    liabilities = list(liabilities_collection.find())  # Fetch all liabilities
    
    # Convert ObjectId to string for each liability
    for liability in liabilities:
        liability['_id'] = str(liability['_id'])
    
    return liabilities, 200
    
# Get liabilities based on filter criteria
def filter_liabilities(filters):
    query = {}
    
    # Dynamically build the query based on provided filters
    if 'Year' in filters:
        query['Year'] = filters['Year']
    
    liabilities = list(liabilities_collection.find(query))
    
    # Convert ObjectId to string for each liability
    for liability in liabilities:
        liability['_id'] = str(liability['_id'])
    
    return liabilities, 200
def get_total_liabilities_by_year(year):
    try:
        # Ensure year is a string
        year = str(year)

        # Build the query filter for the year (no quarter filter)
        query_filter = {'Year': year, 'Type': {'$in': ['Current_Liability', 'NonCurrent_Liability']}}

        # Fetch the matching documents for liabilities
        matching_documents = list(liabilities_collection.find(query_filter))

        # Initialize a variable to store the sum for liabilities
        total_liabilities = 0

        # Loop through the documents and accumulate the amounts for liabilities
        for document in matching_documents:
            amount = document.get('Amount', 0)
            total_liabilities += amount

        # Prepare the response with the total liabilities
        response = {
            'Year': year,
            'TotalLiabilities': total_liabilities
        }

        # Ensure you're returning a proper JSON response
        return jsonify(response), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500 
    
def get_equity_by_year(year):
    try:
        # Ensure 'year' is a string
        year = str(year)

        # Build the query filter for equity
        query_filter = {'Year': year, 'Type': 'Equity'}

        # Fetch the matching documents for equity
        matching_documents = list(liabilities_collection.find(query_filter))

        # Initialize a variable to store the sum for equity
        total_equity = 0

        # Loop through the documents and accumulate the amounts for equity
        for document in matching_documents:
            amount = document.get('Amount', 0)

            total_equity += amount

        # Prepare the response with the total equity
        response = {
            'Year': year,
            'TotalEquity': total_equity
        }

        return jsonify(response), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

