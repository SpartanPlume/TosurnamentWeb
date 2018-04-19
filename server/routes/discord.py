"""/discord route"""

import requests
import time
import uuid
import json
import constants
import helpers.crypt
from routes.base import Base
from databases.token import Token

API_ENDPOINT = "https://discordapp.com/api/v6"
REDIRECT_URI = 'http://localhost:3000/api/discord/callback'

class Discord(Base):
    """/discord route handler"""
    ROUTE = "/discord"

    @staticmethod
    def get(handler, path):
        """GET handler"""
        paths = path.split("/", 1)
        if len(paths) < 2:
            paths.append("")
        if paths[0] in GET_SUBROUTES:
            GET_SUBROUTES[paths[0]](handler, paths[1])
        else:
            handler.send_json("{}")

    @staticmethod
    def get_guilds(handler, path):
        if path:
            paths = path.split("/", 1)
            guild_id = paths[0]
            if len(paths) > 1:
                paths = paths[1].split("/", 1)
                if len(paths) < 2:
                    paths.append("")
                if paths[0] in GET_GUILDS_SUBROUTES:
                    GET_GUILDS_SUBROUTES[paths[0]](handler, paths[1], guild_id)
            else:
                try:
                    r = requests.get(API_ENDPOINT + '/guilds/' + guild_id, headers=headers)
                    r.raise_for_status()
                except requests.exceptions.HTTPError as e:
                    handler.send_json("{}")
                    print(e)
                    print(r.json())
                    return
                handler.send_json(r.text)
        else:
            token = handler.session.query(Token).where(Token.session_token == helpers.crypt.hash_str(handler.session_token)).first()
            if not token:
                handler.send_json("{}")
                return
            headers = {
                'Authorization': 'Bearer ' + token.access_token,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
            try:
                r = requests.get(API_ENDPOINT + '/users/@me/guilds', headers=headers)
                r.raise_for_status()
            except requests.exceptions.HTTPError as e:
                handler.send_json("{}")
                print(e)
                print(r.json())
                return
            handler.send_json(r.text)

    @staticmethod
    def get_roles(handler, path, guild_id):
        headers = {
            'Authorization': 'Bot ' + constants.TOKEN,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        try:
            r = requests.get(API_ENDPOINT + '/guilds/' + guild_id + '/roles', headers=headers)
            r.raise_for_status()
        except requests.exceptions.HTTPError as e:
            handler.send_json("{}")
            print(e)
            print(r.json())
            return
        handler.send_json(r.text)

    @staticmethod
    def get_channels(handler, path, guild_id):
        headers = {
            'Authorization': 'Bot ' + constants.TOKEN,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        try:
            r = requests.get(API_ENDPOINT + '/guilds/' + guild_id + '/channels', headers=headers)
            r.raise_for_status()
        except requests.exceptions.HTTPError as e:
            handler.send_json("{}")
            print(e)
            print(r.json())
            return
        handler.send_json(r.text)

    @staticmethod
    def post(handler, path, data):
        """POST handler"""
        if path in POST_SUBROUTES:
            POST_SUBROUTES[path](handler, data)
        else:
            handler.send_json("{}")

    @staticmethod
    def post_token(handler, data):
        if 'code' in data:
            data_to_post = {
                'client_id': constants.CLIENT_ID,
                'client_secret': constants.CLIENT_SECRET,
                'grant_type': 'authorization_code',
                'code': data['code'],
                'redirect_uri': REDIRECT_URI
            }
            headers = {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
            try:
                r = requests.post('https://discordapp.com/api/oauth2/token', data=data_to_post, headers=headers)
                r.raise_for_status()
            except requests.exceptions.HTTPError as e:
                print(r.json())
                print(e)
                handler.send_json("{}")
                return
            session_token = Discord.store_token(handler, r.json())
            data_to_post = {
                'session_token': session_token
            }
            handler.send_json(json.dumps(data_to_post))
            return
        handler.send_json("{}")

    @staticmethod
    def post_token_revoke(handler, data):
        pass

    @staticmethod
    def store_token(handler, data):
        token = None
        session_token = handler.session_token
        if session_token:
            token = handler.session.query(Token).where(Token.session_token == helpers.crypt.hash_str(session_token)).first()
        if not token:
            token = Token()
            session_token = str(uuid.uuid4())
            token.session_token = session_token
            token.expiry_date = str(int(time.time()) + 604800)
            handler.session.add(token)
        token.access_token = data["access_token"]
        token.token_type = data["token_type"]
        token.expires_in = data["expires_in"]
        token.refresh_token = data["refresh_token"]
        token.scope = data["scope"]
        handler.session.update(token)
        return session_token

    @staticmethod
    def put(handler, path, parameters):
        """PUT handler"""
        handler.send_json("{}")

GET_SUBROUTES = {
    "guilds": Discord.get_guilds
}

GET_GUILDS_SUBROUTES = {
    "roles": Discord.get_roles,
    "channels": Discord.get_channels
}

POST_SUBROUTES = {
    "token": Discord.post_token,
    "token/revoke": Discord.post_token_revoke
}
