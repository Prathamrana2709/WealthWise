from pymongo import MongoClient
from datetime import datetime
import os, certifi

# MongoDB Connection
mongo_connection_string = os.getenv('MONGODB_CONNECTION_STRING')
client = MongoClient(mongo_connection_string, tlsCAFile=certifi.where())
logs_db = client['Logs']
datalog_collection = logs_db['Datalogs']

# Enhanced log entry
def add_log(data, user_agent):
    try:
        required_fields = ["username", "role", "action"]
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return {"error": f"Missing fields: {', '.join(missing_fields)}"}, 400

        log_entry = {
            "username": data["username"],
            "role": data["role"],
            "action": data["action"],
            "timestamp": datetime.now(),
            "user_agent": user_agent or "Unknown"
        }
        print (log_entry)
        datalog_collection.insert_one(log_entry)
        return {"message": "Log entry added successfully"}, 201
    except Exception as e:
        return {"error": str(e)}, 500

# Method to fetch all logs
def get_all_logs():
    try:
        logs = list(datalog_collection.find({}, {'_id': 0}))  # Exclude MongoDB ID
        return {"logs": logs}, 200
    except Exception as e:
        return {"error": str(e)}, 500

# Method to fetch logs by user_id
def get_logs_by_user(user_id):
    try:
        logs = list(datalog_collection.find({"user_id": user_id}, {'_id': 0}))
        if not logs:
            return {"message": f"No logs found for user_id: {user_id}"}, 404
        return {"logs": logs}, 200
    except Exception as e:
        return {"error": str(e)}, 500