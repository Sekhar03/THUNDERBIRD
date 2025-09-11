#!/usr/bin/env python3
"""
Test local ThunderBird services
"""

import requests
import time
import sys

def test_service(name, url, timeout=5):
    """Test if a service is running"""
    try:
        response = requests.get(url, timeout=timeout)
        if response.status_code == 200:
            print(f"✅ {name}: {url} - Status: {response.status_code}")
            return True
        else:
            print(f"❌ {name}: {url} - Status: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ {name}: {url} - Error: {e}")
        return False

def main():
    print("🔍 Testing Local ThunderBird Services")
    print("=" * 50)
    
    services = [
        ("Go Server", "http://localhost:8080/api/status"),
        ("Satellite Simulator", "http://localhost:9090/"),
        ("Quantum Service", "http://localhost:8081/health"),
    ]
    
    all_running = True
    for name, url in services:
        if not test_service(name, url):
            all_running = False
    
    print("\n" + "=" * 50)
    if all_running:
        print("✅ All services are running!")
        print("\n🌐 Open your browser to: http://localhost:3000")
    else:
        print("❌ Some services are not running.")
        print("\n📝 To start all services, run:")
        print("   PowerShell: .\\start-all-services.ps1")
        print("   Batch: start-all-services.bat")
    
    return all_running

if __name__ == "__main__":
    main()
