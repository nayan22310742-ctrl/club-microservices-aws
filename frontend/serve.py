"""
Simple HTTP server to serve the frontend on port 8000.
Run: python serve.py
"""
import http.server
import socketserver
import os

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

os.chdir(DIRECTORY)

Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("0.0.0.0", PORT), Handler) as httpd:
    print(f"Frontend serving at http://0.0.0.0:{PORT}")
    print(f"Open http://localhost:{PORT} in your browser")
    httpd.serve_forever()
