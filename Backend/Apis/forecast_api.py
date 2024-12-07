from flask import Blueprint, jsonify , request , session
from pymongo import MongoClient
from flask_cors import CORS
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_absolute_percentage_error
from pmdarima import auto_arima
import pandas as pd
from datetime import datetime
import numpy as np
import os
import certifi

# MongoDB Atlas connection
mongo_connection_string = os.getenv('MONGODB_CONNECTION_STRING')
client = MongoClient(mongo_connection_string, tlsCAFile=certifi.where())
db = client["Data"]
collection = db["Forecast_expenses"]

def get_forecast():
    # Fetch data from MongoDB
    data = pd.DataFrame(list(collection.find()))
    if '_id' in data.columns:
        data.drop('_id', axis=1, inplace=True)
    data["Date"] = pd.to_datetime(data["Date"], format="%d-%m-%Y")

    # Columns to forecast
    expense_columns = [
        "Employee Benefit Expense",
        "Cost of Equipment and Software Licences",
        "Finance Costs",
        "Depreciation and Amortisation Expense",
        "Operating Expense"
    ]

    # Normalize data for forecasting
    scaler = MinMaxScaler()
    data[expense_columns] = scaler.fit_transform(data[expense_columns])

    # Automate SARIMA model fitting and forecasting
    models = {}
    forecasts = {}
    forecast_horizon = 4  # Next 4 quarters
    seasonal_period = 4  # Quarterly data

    for col in expense_columns:
        # Fit SARIMA model using pmdarima
        model = auto_arima(
            data[col],
            seasonal=True,
            m=seasonal_period,
            stepwise=True,
            suppress_warnings=True,
            error_action="ignore",
            trace=False
        )
        models[col] = model
        forecasts[col] = model.predict(n_periods=forecast_horizon)

    # Create a DataFrame for the forecasted values
    dummy_forecast = np.zeros((forecast_horizon, len(expense_columns)))

    for idx, col in enumerate(expense_columns):
        dummy_forecast[:, idx] = forecasts[col]

    dummy_forecast_df = pd.DataFrame(dummy_forecast, columns=expense_columns)

    # De-normalize forecasted values
    de_normalized_forecasts = scaler.inverse_transform(dummy_forecast_df)

    # Calculate total expense forecast
    total_expense_forecast = np.sum(de_normalized_forecasts, axis=1)

    # Create forecast dates
    last_date = data["Date"].iloc[-1]
    forecast_dates = [
        (last_date + pd.offsets.QuarterEnd(i)).strftime('%d-%m-%Y') for i in range(1, forecast_horizon + 1)
    ]

    print("Forecasting completed successfully.")
    
    # Prepare JSON response
    forecast_response = {
        "forecast_dates": forecast_dates,
        "forecasts": {
            col: de_normalized_forecasts[:, idx].tolist() for idx, col in enumerate(expense_columns)
        },
        "total_expense_forecast": total_expense_forecast.tolist()
    }

    # Return JSON response to the frontend
    return forecast_response , 200

# def get_accuracy():
#     # Fetch data from MongoDB
#     data = pd.DataFrame(list(collection.find()))
#     if '_id' in data.columns:
#         data.drop('_id', axis=1, inplace=True)
#     data["Date"] = pd.to_datetime(data["Date"], format="%d-%m-%Y")

#     # Columns to forecast
#     expense_columns = [
#         "Employee Benefit Expense",
#         "Cost of Equipment and Software Licences",
#         "Finance Costs",
#         "Depreciation and Amortisation Expense",
#         "Operating Expense"
#     ]

#     # Normalize data for forecasting
#     scaler = MinMaxScaler()
#     try:
#         data[expense_columns] = scaler.fit_transform(data[expense_columns])
#     except ValueError as e:
#         print(f"Error during normalization: {e}")
#         return jsonify({"error": "Normalization failed. Check data for consistency."}), 500

#     test_data_summary = []
#     forecast_dates = []
#     forecasted_values = {col: [] for col in expense_columns}
#     forecast_horizon = 2  # Next 2 quarters
#     seasonal_period = 4  # Quarterly data

#     for col in expense_columns:
#         try:
#             # Validate column data
#             if data[col].nunique() <= 1:
#                 print(f"Skipping column {col}: Insufficient unique values.")
#                 continue

#             # Split data into training and testing sets
#             train_data = data[col][:-2]  # All except the last two data points
#             test_data = data.iloc[-2:]  # The last two rows (dates and normalized values)

#             if train_data.sum() == 0 or train_data.std() == 0:
#                 print(f"Skipping column {col}: Training data has zero variance or is invalid.")
#                 continue

#             # Fit SARIMA model
#             model = auto_arima(
#                 train_data,
#                 seasonal=True,
#                 m=seasonal_period,
#                 stepwise=True,
#                 suppress_warnings=True,
#                 error_action="ignore",
#                 trace=False
#             )

#             # Predict the last two data points
#             predictions = model.predict(n_periods=forecast_horizon)
#             # De-normalize predictions for the specific column
#             predictions = scaler.inverse_transform(
#                 [[pred if idx == expense_columns.index(col) else 0 for idx in range(len(expense_columns))] for pred in predictions]
#             )[:, expense_columns.index(col)]
            
#             # De-normalize true values for the last two data points
#             true_values = scaler.inverse_transform(data[expense_columns])[-2:, expense_columns.index(col)]

#             # Add corresponding dates for test data
#             test_dates = test_data["Date"].dt.strftime('%d-%m-%Y').tolist()

#             # Calculate accuracy for each test point
#             for i in range(forecast_horizon):
#                 true_value = float(true_values[i])  # Ensure it's a Python float
#                 predicted_value = float(predictions[i])  # Ensure it's a Python float
#                 mape = mean_absolute_percentage_error([true_value], [predicted_value])
#                 accuracy = 100 - (mape * 100)

#                 test_data_summary.append({
#                     "category": col,
#                     "date": test_dates[i],
#                     "true_value": round(true_value, 2),
#                     "predicted_value": round(predicted_value, 2),
#                     "accuracy": round(accuracy, 2)
#                 })

#             # Forecast using the entire dataset
#             model.fit(data[col])
#             forecasts = model.predict(n_periods=forecast_horizon)
#             forecasted_values[col] = list(map(float, scaler.inverse_transform(
#                 [[forecast if idx == expense_columns.index(col) else 0 for idx in range(len(expense_columns))] for forecast in forecasts]
#             )[:, expense_columns.index(col)]))

#         except Exception as e:
#             print(f"Error processing column {col}: {e}")
#             forecasted_values[col] = [0] * forecast_horizon

#     # Create forecast dates
#     last_date = data["Date"].iloc[-1]
#     forecast_dates = [
#         (last_date + pd.offsets.QuarterEnd(i)).strftime('%d-%m-%Y') for i in range(1, forecast_horizon + 1)
#     ]

#     # Prepare JSON response
#     forecast_response = {
#         "forecast_dates": forecast_dates,
#         "forecasts": forecasted_values,
#         "test_summary": test_data_summary
#     }

#     return forecast_response, 200

def get_accuracy():
    # Fetch data from MongoDB
    data = pd.DataFrame(list(collection.find()))
    if '_id' in data.columns:
        data.drop('_id', axis=1, inplace=True)
    data["Date"] = pd.to_datetime(data["Date"], format="%d-%m-%Y")

    # Columns to forecast
    expense_columns = [
        "Employee Benefit Expense",
        "Cost of Equipment and Software Licences",
        "Finance Costs",
        "Depreciation and Amortisation Expense",
        "Operating Expense"
    ]

    # Normalize data for forecasting
    scaler = MinMaxScaler()
    try:
        data[expense_columns] = scaler.fit_transform(data[expense_columns])
    except ValueError as e:
        print(f"Error during normalization: {e}")
        return jsonify({"error": "Normalization failed. Check data for consistency."}), 500

    test_data_summary = []
    forecasted_values = {col: [] for col in expense_columns}
    forecast_horizon = 2  # Next 2 quarters for forecasting
    seasonal_period = 4  # Quarterly data

    for col in expense_columns:
        try:
            # Validate column data
            if data[col].nunique() <= 1:
                print(f"Skipping column {col}: Insufficient unique values.")
                continue

            # Split data into training and testing sets
            train_data = data[col][:-2]  # All except the last two data points
            test_data = data.iloc[-2:]  # The last two rows (dates and normalized values)

            if train_data.sum() == 0 or train_data.std() == 0:
                print(f"Skipping column {col}: Training data has zero variance or is invalid.")
                continue

            # Fit SARIMA model
            model = auto_arima(
                train_data,
                seasonal=True,
                m=seasonal_period,
                stepwise=True,
                suppress_warnings=True,
                error_action="ignore",
                trace=False
            )

            # Predict the last two data points
            predictions = model.predict(n_periods=2)
            # De-normalize predictions for the specific column
            predictions_denorm = scaler.inverse_transform(
                [[pred if idx == expense_columns.index(col) else 0 for idx in range(len(expense_columns))] for pred in predictions]
            )[:, expense_columns.index(col)]
            
            # De-normalize true values for the last two data points
            true_values_denorm = scaler.inverse_transform(data.iloc[-2:][expense_columns])[:, expense_columns.index(col)]

            # Add corresponding dates for test data
            test_dates = data["Date"].iloc[-2:].dt.strftime('%d-%m-%Y').tolist()

            # Calculate accuracy for each test point
            for i in range(2):  # Use the last two data points
                true_value = float(true_values_denorm[i])  # Ensure it's a Python float
                predicted_value = float(predictions_denorm[i])  # Ensure it's a Python float
                mape = mean_absolute_percentage_error([true_value], [predicted_value])
                accuracy = 100 - (mape * 100)

                test_data_summary.append({
                    "category": col,
                    "date": test_dates[i],
                    "true_value": round(true_value, 2),
                    "predicted_value": round(predicted_value, 2),
                    "accuracy": round(accuracy, 2)
                })

            # Forecast using the entire dataset
            model.fit(data[col])
            future_forecasts = model.predict(n_periods=forecast_horizon)
            forecasted_values[col] = list(map(float, scaler.inverse_transform(
                [[forecast if idx == expense_columns.index(col) else 0 for idx in range(len(expense_columns))] for forecast in future_forecasts]
            )[:, expense_columns.index(col)]))

        except Exception as e:
            print(f"Error processing column {col}: {e}")
            forecasted_values[col] = [0] * forecast_horizon

    # Create forecast dates
    last_date = data["Date"].iloc[-1]
    forecast_dates = [
        (last_date + pd.offsets.QuarterEnd(i)).strftime('%d-%m-%Y') for i in range(1, forecast_horizon + 1)
    ]

    # Prepare JSON response
    forecast_response = {
        "forecast_dates": forecast_dates,
        "forecasts": forecasted_values,
        "test_summary": test_data_summary
    }

    return forecast_response, 200

db = client["Logs"]
forecast_logs_collection = db["forecastlogs"]

def log_predictions(newlog):
    try:
        # Get the predictions data from the request
        log_data = newlog
        
        print(f'I am {log_data["user"]} as {log_data["role"]}')
        if not log_data:
            return jsonify({"error": "No data provided"}), 400

        # Add metadata (user, role, timestamp)
        try:
            log_entry = {
                "user": log_data["user"],
                "role": log_data["role"],
                "timestamp": datetime.now().isoformat(),
                "forecast_date": log_data["forecast_dates"],
                "forecasts": log_data["forecasts"],
                "total_expense_forecast": log_data["total_expense_forecast"],
            }
            print("LE :", log_entry)
        except KeyError as e:
            print(f"Missing key in log_data: {e}")
            return jsonify({"error": f"Missing key: {e}"}), 400
        except Exception as e:
            print(f"Unexpected error: {e}")
            return jsonify({"error": str(e)}), 500

        # Save log entry to MongoDB
        forecast_logs_collection.insert_one(log_entry)
        print("Do i reach here ? ")

        return jsonify({"message": "Log saved successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    


def get_forecastlogs():
    try:
        # Retrieve all logs from the MongoDB collection, sorted by timestamp (latest first)
        logs = list(forecast_logs_collection.find().sort("timestamp", -1))

        # Format the logs for JSON serialization
        formatted_logs = []
        for log in logs:
            formatted_logs.append({
                "user": log.get("user", "Unknown User"),
                "role": log.get("role", "Unknown Role"),
                "timestamp": log.get("timestamp"),
                "forecast_date": log.get("forecast_date", []),
                "forecasts": log.get("forecasts", {}),
                "total_expense_forecast": log.get("total_expense_forecast", [])
            })

        return formatted_logs, 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
