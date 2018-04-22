"""Starts the server"""

import os
import sys
import importlib
import signal
from http.server import HTTPServer
import mysql_wrapper
import constants
from server.handler import create_my_handler

ROUTES_DIR = "routes"
ROUTER_MODULE = "routes.index"

def signal_handler(signal, frame):
    sys.exit(0)

def main():
    """Main function"""
    signal.signal(signal.SIGINT, signal_handler)
    try:
        module = importlib.import_module(ROUTER_MODULE)
    except ModuleNotFoundError:
        return 1
    for dirpath, dirnames, filenames in os.walk(ROUTES_DIR):
        for filename in filenames:
            if filename.endswith(".py"):
                importlib.import_module(dirpath.replace("/", ".").replace("\\", ".") + "." + filename[:-3])
    handler = create_my_handler(module, mysql_wrapper.Session(constants.DATABASE_USERNAME, constants.DATABASE_PASSWORD, "tosurnament"))
    httpd = HTTPServer(("localhost", 4000), handler)
    print("Started server at http://localhost:4000")
    httpd.serve_forever()

if __name__ == '__main__':
    sys.exit(main())
