import json

# Test data for admin login
login_data = {
    "username": "admin",
    "password": "demo123"
}

# Write to a temporary file for curl to use
with open("login_data.json", "w") as f:
    json.dump(login_data, f)

print("Created login_data.json for curl testing")