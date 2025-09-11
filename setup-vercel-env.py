#!/usr/bin/env python3
"""
Quick setup script to generate Vercel environment variable commands
"""

def generate_vercel_commands(server_url, simulator_url, quantum_url):
    """Generate Vercel CLI commands for setting environment variables"""
    
    print("🔧 Vercel Environment Variables Setup")
    print("=" * 50)
    print("\n1. Using Vercel CLI (if you have it installed):")
    print("-" * 30)
    print(f"vercel env add NEXT_PUBLIC_SERVER_URL")
    print(f"  Value: {server_url}")
    print(f"  Environment: Production")
    print()
    print(f"vercel env add NEXT_PUBLIC_SIMULATOR_URL")
    print(f"  Value: {simulator_url}")
    print(f"  Environment: Production")
    print()
    print(f"vercel env add NEXT_PUBLIC_QUANTUM_URL")
    print(f"  Value: {quantum_url}")
    print(f"  Environment: Production")
    
    print("\n2. Using Vercel Dashboard:")
    print("-" * 30)
    print("Go to: https://vercel.com/dashboard")
    print("→ Your Project → Settings → Environment Variables")
    print("Add these variables:")
    print(f"  NEXT_PUBLIC_SERVER_URL = {server_url}")
    print(f"  NEXT_PUBLIC_SIMULATOR_URL = {simulator_url}")
    print(f"  NEXT_PUBLIC_QUANTUM_URL = {quantum_url}")
    
    print("\n3. Railway Environment Variables (for Main Server):")
    print("-" * 30)
    print("Go to your Main Server Railway project → Variables")
    print("Add these variables:")
    print(f"  SIMULATOR_URL = {simulator_url}")
    print(f"  QUANTUM_URL = {quantum_url}")

def main():
    print("🚀 ThunderBird Vercel Configuration Generator")
    print("=" * 50)
    
    # Get URLs from user
    server_url = input("Enter your Main Server Railway URL: ").strip()
    simulator_url = input("Enter your Simulator Railway URL: ").strip()
    quantum_url = input("Enter your Quantum Service Railway URL: ").strip()
    
    if not all([server_url, simulator_url, quantum_url]):
        print("❌ Please provide all three URLs")
        return
    
    # Ensure URLs have https://
    if not server_url.startswith('http'):
        server_url = 'https://' + server_url
    if not simulator_url.startswith('http'):
        simulator_url = 'https://' + simulator_url
    if not quantum_url.startswith('http'):
        quantum_url = 'https://' + quantum_url
    
    generate_vercel_commands(server_url, simulator_url, quantum_url)
    
    print("\n" + "=" * 50)
    print("✅ Configuration complete!")
    print("\n📝 Next steps:")
    print("1. Set the environment variables as shown above")
    print("2. Redeploy your Vercel project")
    print("3. Test your application")

if __name__ == "__main__":
    main()
