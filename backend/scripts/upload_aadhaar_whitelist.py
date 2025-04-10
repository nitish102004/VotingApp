#!/usr/bin/env python3
"""
Script to upload a list of Aadhaar numbers to the MongoDB database.
This script reads Aadhaar numbers from a CSV file and uploads them to the AadhaarWhitelist collection.

Usage:
    python upload_aadhaar_whitelist.py --file aadhaar_list.csv --db mongodb://localhost:27017/voting-app

The CSV file should have a column named 'aadhaar_number' containing the 12-digit Aadhaar numbers.
"""

import argparse
import csv
import os
from pymongo import MongoClient, errors
from dotenv import load_dotenv
import re

# Load environment variables from .env file (if exists)
load_dotenv()

def validate_aadhaar(aadhaar_number):
    """Validate that the Aadhaar number is a 12-digit number."""
    return bool(re.match(r'^\d{12}$', aadhaar_number))

def main():
    parser = argparse.ArgumentParser(description='Upload Aadhaar numbers to MongoDB')
    parser.add_argument('--file', required=True, help='Path to CSV file containing Aadhaar numbers')
    parser.add_argument('--db', default=os.getenv('MONGODB_URI', 'mongodb://localhost:27017/voting-app'),
                        help='MongoDB connection string')
    args = parser.parse_args()

    # Connect to MongoDB
    try:
        client = MongoClient(args.db)
        db_name = args.db.split('/')[-1]
        db = client[db_name]
        collection = db['aadhaarwhitelists']  # Collection name based on mongoose model
        print(f"Connected to MongoDB: {args.db}")
    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")
        return

    # Read CSV file
    try:
        with open(args.file, 'r') as csvfile:
            reader = csv.DictReader(csvfile)
            
            # Check if 'aadhaar_number' column exists
            if 'aadhaar_number' not in reader.fieldnames:
                print("Error: CSV file must have an 'aadhaar_number' column")
                return
            
            # Process each row
            success_count = 0
            error_count = 0
            duplicate_count = 0
            
            for row in reader:
                aadhaar_number = row['aadhaar_number'].strip()
                
                # Validate Aadhaar number
                if not validate_aadhaar(aadhaar_number):
                    print(f"Skipping invalid Aadhaar number: {aadhaar_number}")
                    error_count += 1
                    continue
                
                # Create document
                document = {
                    'aadhaarNumber': aadhaar_number,
                    'isUsed': False,
                    'createdAt': datetime.datetime.now(),
                    'updatedAt': datetime.datetime.now()
                }
                
                # Insert document, ignoring duplicates
                try:
                    result = collection.update_one(
                        {'aadhaarNumber': aadhaar_number},
                        {'$setOnInsert': document},
                        upsert=True
                    )
                    if result.upserted_id:
                        success_count += 1
                    else:
                        duplicate_count += 1
                except Exception as e:
                    print(f"Error inserting Aadhaar number {aadhaar_number}: {e}")
                    error_count += 1
            
            print(f"Upload complete: {success_count} inserted, {duplicate_count} duplicates, {error_count} errors")
    except Exception as e:
        print(f"Error processing CSV file: {e}")

if __name__ == "__main__":
    import datetime  # Import here to avoid circular import
    main() 