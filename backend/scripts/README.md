# Aadhaar Whitelist Upload Script

This folder contains scripts for managing the voting application database, particularly for uploading Aadhaar numbers to the whitelist.

## Prerequisites

Before using these scripts, you need to install the required Python packages:

```bash
pip install pymongo python-dotenv
```

## Upload Aadhaar Whitelist

The `upload_aadhaar_whitelist.py` script allows you to upload a list of Aadhaar numbers from a CSV file to the MongoDB database.

### CSV Format

The CSV file should have the following format:

```
aadhaar_number
123456789012
234567890123
...
```

A sample CSV file is provided: `sample_aadhaar_list.csv`

### Usage

```bash
python upload_aadhaar_whitelist.py --file aadhaar_list.csv --db mongodb://localhost:27017/voting-app
```

Options:
- `--file`: Path to the CSV file containing Aadhaar numbers (required)
- `--db`: MongoDB connection string (optional, defaults to the MONGODB_URI environment variable or `mongodb://localhost:27017/voting-app`)

### Environment Variables

You can set the following environment variables in a `.env` file:

```
MONGODB_URI=mongodb://localhost:27017/voting-app
```

## Troubleshooting

If you encounter errors:

1. Make sure MongoDB is running
2. Check that the CSV file format is correct
3. Verify that the Aadhaar numbers are valid (12-digit numbers)
4. Check the database connection string 