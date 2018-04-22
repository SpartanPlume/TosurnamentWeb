"""Handler of requests"""

import json
from http.server import BaseHTTPRequestHandler

def create_my_handler(router, session):
    class MyHandler(BaseHTTPRequestHandler):
        """Chooses the correct route"""
        def __init__(self, *args, **kwargs):
            self.router = router
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
            self.send_json(json.dumps(obj, default=(lambda obj: obj.get_dict())))

        def send_array(self, array):
            self.send_json(json.dumps(array, default=(lambda obj: obj.get_dict())))

        def do_GET(self):
            self.session_token = self.headers.get("Authorization")
            method_to_do = getattr(self.router, "get")
            if not method_to_do:
                #TODO
                self.send_json("{}")
            print(self.path)
            method_to_do(self, self.path)

        def do_POST(self):
            body = self.rfile.read(int(self.headers.get('content-length', 0)))
            parameters = json.loads(body.decode('utf-8'))
            self.session_token = None
            if "session_token" in parameters:
                self.session_token = parameters["session_token"]
            self.session_token = self.headers.get("Authorization")
            method_to_do = getattr(self.router, "post")
            if not method_to_do:
                #TODO
                self.send_json("{}")
            print(self.path)
            method_to_do(self, self.path, parameters)

        def do_PUT(self):
            body = self.rfile.read(int(self.headers.get('content-length', 0)))
            parameters = json.loads(body.decode('utf-8'))
            self.session_token = self.headers.get("Authorization")
            method_to_do = getattr(self.router, "put")
            if not method_to_do:
                #TODO
                self.send_json("{}")
            print(self.path)
            method_to_do(self, self.path, parameters)

        def do_DELETE(self):
            self.session_token = self.headers.get("Authorization")
            method_to_do = getattr(self.router, "delete")
            if not method_to_do:
                #TODO
                self.send_json("{}")
            print(self.path)
            method_to_do(self, self.path)

        def do_OPTIONS(self):
            self.send_response(200, "ok")
            self.send_header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS')
            self.send_header("Access-Control-Allow-Headers", "Content-type, Authorization")
            self.end_headers()
    return MyHandler