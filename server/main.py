"""Starts the server"""

import os
import sys
import importlib
import signal
from http.server import BaseHTTPRequestHandler, HTTPServer
from routes.base import Base
import mysql_wrapper
import constants
import json

ROUTES_DIR = "routes"

def create_my_handler(session):
    class MyHandler(BaseHTTPRequestHandler):
        """Chooses the correct route"""
        def __init__(self, *args, **kwargs):
            self.session = session
            super(MyHandler, self).__init__(*args, **kwargs)

        def end_headers(self):
            self.send_header('Access-Control-Allow-Origin', '*')
            BaseHTTPRequestHandler.end_headers(self)

        def send_json(self, message):
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(bytes(message, "utf8"))

        def send_object(self, obj):
            self.send_json(obj.get_json())

        def send_array(self, array):
            json_array = []
            for obj in array:
                json_array.append(obj.get_json())
            self.send_json(str(json_array))

        def do_GET(self):
            for subclass in Base.__subclasses__():
                if "ROUTE" in vars(subclass):
                    if self.path.startswith(subclass.ROUTE):
                        new_path = self.path[len(subclass.ROUTE):]
                        while new_path.startswith('/'):
                            new_path = new_path[1:]
                        subclass.get(self, new_path)

        def do_POST(self):
            body = self.rfile.read(int(self.headers.get('content-length', 0)))
            parameters = json.loads(body.decode('utf-8'))
            for subclass in Base.__subclasses__():
                if "ROUTE" in vars(subclass):
                    if self.path.startswith(subclass.ROUTE):
                        new_path = self.path[len(subclass.ROUTE):]
                        while new_path.startswith('/'):
                            new_path = new_path[1:]
                        subclass.post(self, new_path, parameters)            

        def do_PUT(self):
            body = self.rfile.read(int(self.headers.get('content-length', 0)))
            parameters = json.loads(body.decode('utf-8'))
            for subclass in Base.__subclasses__():
                if "ROUTE" in vars(subclass):
                    if self.path.startswith(subclass.ROUTE):
                        new_path = self.path[len(subclass.ROUTE):]
                        while new_path.startswith('/'):
                            new_path = new_path[1:]
                        subclass.put(self, new_path, parameters)

        def do_DELETE(self):
            for subclass in Base.__subclasses__():
                if "ROUTE" in vars(subclass):
                    if self.path.startswith(subclass.ROUTE):
                        new_path = self.path[len(subclass.ROUTE):]
                        while new_path.startswith('/'):
                            new_path = new_path[1:]
                        subclass.delete(self, new_path)

        def do_OPTIONS(self):
            self.send_response(200, "ok")
            self.send_header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS')
            self.send_header("Access-Control-Allow-Headers", "Content-type")
            self.end_headers()
    return MyHandler

def signal_handler(signal, frame):
    sys.exit(0)

def main():
    """Main function"""
    signal.signal(signal.SIGINT, signal_handler)
    for filename in os.listdir(ROUTES_DIR):
        if filename != "base.py" and filename.endswith(".py"):
            importlib.import_module(ROUTES_DIR + "." + filename[:-3])
    handler = create_my_handler(mysql_wrapper.Session(constants.DATABASE_USERNAME, constants.DATABASE_PASSWORD, "tosurnament"))
    httpd = HTTPServer(("localhost", 4000), handler)
    print("Started server at http://localhost:4000")
    httpd.serve_forever()

if __name__ == '__main__':
    sys.exit(main())
