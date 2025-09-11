#!/usr/bin/env python3
"""
Test script to verify all ThunderBird services are running correctly
"""

import requests
import json
import sys
from urllib.parse import urljoin

def test_service(name, base_url, endpoints):
    """Test a service with multiple endpoints"""
    print(f"\n🔍 Testing {name} at {base_url}")
    
    for endpoint, expected_status in endpoints.items():
        url = urljoin(base_url, endpoint)
        try:
            response = requests.get(url, timeout=10)
            if response.status_code == expected_status:
                print(f"  ✅ {endpoint} - Status: {response.status_code}")
                if response.headers.get('content-type', '').startswith('application/json'):
                    data = response.json()
                    print(f"     Response: {json.dumps(data, indent=2)[:200]}...")
            else:
                print(f"  ❌ {endpoint} - Expected: {expected_status}, Got: {response.status_code}")
        except requests.exceptions.RequestException as e:
            print(f"  ❌ {endpoint} - Error: {e}")

def main():
    print("🚀 ThunderBird Services Health Check")
    print("=" * 50)
    
    # Replace these URLs with your actual Railway URLs
    services = {
        "Main Server": {
            "url": "https://your-server.railway.app",
            "endpoints": {
                "/api/status": 200,
                "/api/mode": 405  # Method not allowed for GET
            }
        },
        "Satellite Simulator": {
            "url": "https://your-simulator.railway.app", 
            "endpoints": {
                "/": 200
            }
        },
        "Quantum Service": {
            "url": "https://your-quantum.railway.app",
            "endpoints": {
                "/health": 200,
                "/generate-key": 200
            }
        }
    }
    
    for name, config in services.items():
        test_service(name, config["url"], config["endpoints"])
    
    print("\n" + "=" * 50)
    print("✅ Health check complete!")
    print("\n📝 Next steps:")
    print("1. Update the URLs in this script with your actual Railway URLs")
    print("2. Run: python test-services.py")
    print("3. Set environment variables in Vercel")
    print("4. Redeploy Vercel")

if __name__ == "__main__":
    main()
