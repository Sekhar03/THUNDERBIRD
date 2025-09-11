#!/usr/bin/env python3
"""
Quantum Key Generation Server
Provides HTTP API for quantum key generation
"""

import os
import json
import sys
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import threading
import time

# Add current directory to path for imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from my_qiskit_script import generate_quantum_key
except ImportError:
    print("Error: Could not import my_qiskit_script")
    sys.exit(1)

class QuantumHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        parsed_path = urlparse(self.path)
        
        if parsed_path.path == '/health':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            response = {"status": "healthy", "service": "quantum-key-generation"}
            self.wfile.write(json.dumps(response).encode())
            
        elif parsed_path.path == '/generate-key':
            try:
                # Generate quantum key
                key_data = generate_quantum_key()
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                
                response = {
                    "success": True,
                    "key": key_data,
                    "timestamp": time.time()
                }
                self.wfile.write(json.dumps(response).encode())
                
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                
                response = {
                    "success": False,
                    "error": str(e),
                    "timestamp": time.time()
                }
                self.wfile.write(json.dumps(response).encode())
        else:
            self.send_response(404)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            response = {"error": "Not found"}
            self.wfile.write(json.dumps(response).encode())

def main():
    port = int(os.environ.get('PORT', 8081))
    
    print(f"🔬 Quantum Key Generation Server starting on port {port}")
    
    server = HTTPServer(('0.0.0.0', port), QuantumHandler)
    print(f"Server running at http://0.0.0.0:{port}")
    print("Endpoints:")
    print(f"  GET /health - Health check")
    print(f"  GET /generate-key - Generate quantum key")
    
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down quantum server...")
        server.shutdown()

if __name__ == '__main__':
    main()
