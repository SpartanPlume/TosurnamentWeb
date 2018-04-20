"""Route to all guilds"""

import requests
from databases.token import Token
from helpers.crypt import hash_str

API_ENDPOINT = 'https://discordapp.com/api/v6'

def get(handler, parameters, url_parameters, ids_parameters):
    """GET method"""
    token = handler.session.query(Token).where(Token.session_token == hash_str(handler.session_token)).first()
    if not token:
        print("GET: all: guilds: 401 Unauthorized")
        handler.send_json("{}")
        return
    headers = {
        'Authorization': 'Bearer ' + token.access_token
    }
    try:
        r = requests.get(API_ENDPOINT + '/users/@me/guilds', headers=headers)
        r.raise_for_status()
    except requests.exceptions.HTTPError as e:
        print("GET: all: guilds: Error")
        print(e)
        print(r.json())
        handler.send_json("{}")
        return
    print("GET: all: guilds: Success")
    handler.send_json(r.text)
