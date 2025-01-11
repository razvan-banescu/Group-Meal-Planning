from http.server import HTTPServer, BaseHTTPRequestHandler
import json
from config import FAMILY_AFFILIATIONS


class SimpleHTTPRequestHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()

        if self.path == "/api/affiliations/":
            self.wfile.write(json.dumps(FAMILY_AFFILIATIONS).encode())
        else:
            self.wfile.write(json.dumps({"message": "Welcome"}).encode())

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header(
            "Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS"
        )
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()


httpd = HTTPServer(("localhost", 8000), SimpleHTTPRequestHandler)
print("Server running on http://localhost:8000")
httpd.serve_forever()
