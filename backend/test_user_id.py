import requests
import json

BASE_URL = "http://localhost:5000/api"

# Test 1: Create a sample test data
print("=" * 60)
print("Testing User ID Functionality")
print("=" * 60)

# First, let's get active occupancies
print("\n1. Getting active occupancies...")
response = requests.get(f"{BASE_URL}/occupancy/active")
print(f"Status: {response.status_code}")
if response.status_code == 200:
    data = response.json()
    print(f"Data: {json.dumps(data, indent=2)}")
    if data.get('data'):
        for occ in data['data']:
            print(f"\n  Occupancy ID: {occ['id']}")
            print(f"  User ID: {occ.get('user_id', 'NOT SET')}")
else:
    print(f"Error: {response.text}")

# Get all bills
print("\n2. Getting all billing records...")
response = requests.get(f"{BASE_URL}/billing/")
print(f"Status: {response.status_code}")
if response.status_code == 200:
    data = response.json()
    print(f"Data: {json.dumps(data, indent=2)}")
    if data.get('data'):
        for bill in data['data']:
            print(f"\n  Bill ID: {bill['id']}")
            print(f"  User ID: {bill.get('user_id', 'NOT SET')}")
else:
    print(f"Error: {response.text}")

print("\n" + "=" * 60)
print("Test Complete!")
print("=" * 60)
