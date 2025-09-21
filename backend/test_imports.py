#!/usr/bin/env python3
"""
Test script to debug import issues
"""
import sys
import traceback

print("=== Testing Imports ===")

try:
    print("1. Testing routers.ai_agents import...")
    from routers import ai_agents
    print(f"   ✓ Success! Routes: {len(ai_agents.router.routes)}")
except Exception as e:
    print(f"   ✗ Failed: {e}")
    traceback.print_exc()

try:
    print("2. Testing main app import...")
    from main import app
    print(f"   ✓ Success! Total routes: {len(app.routes)}")
    
    admin_routes = [r.path for r in app.routes if hasattr(r, 'path') and 'admin' in r.path]
    print(f"   ✓ Admin routes: {len(admin_routes)}")
    if admin_routes:
        print(f"   ✓ Login route found: {'/api/admin/auth/login' in admin_routes}")
    
except Exception as e:
    print(f"   ✗ Failed: {e}")
    traceback.print_exc()

print("=== Import Test Complete ===")