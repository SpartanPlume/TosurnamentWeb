"""Handler of requests"""

import json
import requests
import time
from Crypto.Hash import SHA256
from http.server import BaseHTTPRequestHandler
import server.errors
import constants

def create_my_handler(router, session):
    class MyHandler(BaseHTTPRequestHandler):
        """Chooses the correct route"""
        def __init__(self, *args, **kwargs):
            self.router = router
            self.session = session
            super(MyHandler, self).__init__(*args, **kwargs)

        def get_etag(self, obj):
            if not isinstance(obj, str):
                etag = json.dumps(obj, default=(lambda obj: obj.get_dict()))
            else:
                etag = obj
            sha = SHA256.new()
            sha.update(str.encode(etag, 'utf-8'))
            etag = sha.hexdigest()
            client_etag = self.headers.get('If-None-Match')
            if client_etag == etag:
                return None
            return etag

        def end_headers(self):
            self.send_header('Access-Control-Allow-Origin', '*')
            BaseHTTPRequestHandler.end_headers(self)

        def send_json(self, message, etag=None):
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            if etag:
                self.send_header('Cache-Control', 'max-age=60')
                self.send_header('Etag', etag)
            self.end_headers()
            self.wfile.write(bytes(message, "utf8"))

        def send_object(self, obj, etag=None):
            self.send_json(json.dumps(obj, default=(lambda obj: obj.get_dict())), etag)

        def send_error(self, error_code, description=""):
            self.send_response(error_code)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            if error_code != 304:
                self.wfile.write(bytes(json.dumps(server.errors.get_json_from_error(error_code, description)), "utf8"))

        def refresh_token(self, token):
            if int(token.access_token_expiry_date) < int(time.time()):
                data = {
                    'client_id': constants.CLIENT_ID,
                    'client_secret': constants.CLIENT_SECRET,
                    'grant_type': 'refresh_token',
                    'refresh_token': token.refresh_token,
                    'redirect_uri': constants.DISCORD_REDIRECT_URI,
                    'scope': token.scope
                }
                headers = {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
                try:
                    r = requests.post(constants.DISCORD_OAUTH2_ENDPOINT + '/token', data=data, headers=headers)
                    r.raise_for_status()
                except requests.exceptions.HTTPError:
                    if "logger" in vars(self):
                        self.logger.exception("Couldn't post the data to Discord API.")
                        self.logger.debug(r.text)
                    self.send_error(500, "Couldn't post the data to Discord API.")
                    return
                token.access_token = data["access_token"]
                token.token_type = data["token_type"]
                token.access_token_expiry_date = str(int(time.time()) + data["expires_in"])
                token.refresh_token = data["refresh_token"]
                token.scope = data["scope"]
                self.session.update(token)

        def do_GET(self):
            self.session_token = self.headers.get("Authorization")
            try:
                method_to_do = getattr(self.router, "get")
            except AttributeError:
                self.send_error(404, "The resource at the location specified doesn't exist")
            print(self.path)
            method_to_do(self, self.path)

        def do_POST(self):
            body = self.rfile.read(int(self.headers.get('content-length', 0)))
            try:
                parameters = json.loads(body.decode('utf-8'))
            except json.JSONDecodeError:
                parameters = None
            self.session_token = self.headers.get("Authorization")
            try:
                method_to_do = getattr(self.router, "post")
            except AttributeError:
                self.send_error(404, "The resource at the location specified doesn't exist")
            print(self.path)
            method_to_do(self, self.path, parameters)

        def do_PUT(self):
            body = self.rfile.read(int(self.headers.get('content-length', 0)))
            parameters = json.loads(body.decode('utf-8'))
            self.session_token = self.headers.get("Authorization")
            try:
                method_to_do = getattr(self.router, "put")
            except AttributeError:
                self.send_error(404, "The resource at the location specified doesn't exist")
            print(self.path)
            method_to_do(self, self.path, parameters)

        def do_DELETE(self):
            self.session_token = self.headers.get("Authorization")
            try:
                method_to_do = getattr(self.router, "delete")
            except AttributeError:
                self.send_error(404, "The resource at the location specified doesn't exist")
            print(self.path)
            method_to_do(self, self.path)

        def do_OPTIONS(self):
            self.send_response(200, "ok")
            self.send_header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS')
            self.send_header("Access-Control-Allow-Headers", "Content-type, Authorization")
            self.end_headers()
    return MyHandler