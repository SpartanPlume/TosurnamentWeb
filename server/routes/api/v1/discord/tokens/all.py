"""Route to all tokens"""

import requests
import time
import uuid
import json
import constants
from databases.token import Token
from helpers.crypt import hash_str

API_ENDPOINT = 'https://discordapp.com/api/v6'

def get_user_id(handler, data):
    headers = {
        'Authorization': 'Bearer ' + data["access_token"]
    }
    try:
        r = requests.get(API_ENDPOINT + '/users/@me', headers=headers)
        r.raise_for_status()
    except requests.exceptions.HTTPError:
        handler.logger.exception("Couldn't get the data from Discord API.")
        handler.logger.debug(r.text)
        handler.send_error(500, "Couldn't get the data from Discord API.")
        return None
    user = json.loads(r.text)
    return user["id"]

def store_token(handler, data):
    token = None
    session_token = handler.session_token
    if session_token:
        token = handler.session.query(Token).where(Token.session_token == hash_str(session_token)).first()
    if not token:
        token = Token()
        token.discord_user_id = get_user_id(handler, data)
        if not token.discord_user_id:
            return None
        session_token = str(uuid.uuid4())
        token.session_token = session_token
        token.expiry_date = str(int(time.time()) + 2592000)
        handler.session.add(token)
    token.access_token = data["access_token"]
    token.token_type = data["token_type"]
    token.access_token_expiry_date = str(int(time.time()) + data["expires_in"])
    token.refresh_token = data["refresh_token"]
    token.scope = data["scope"]
    handler.session.update(token)
    return session_token

def post(handler, parameters, url_parameters, ids_parameters):
    """POST method"""
    if 'code' in parameters:
        data = {
            'client_id': constants.CLIENT_ID,
            'client_secret': constants.CLIENT_SECRET,
            'grant_type': 'authorization_code',
            'code': parameters['code'],
            'redirect_uri': constants.DISCORD_REDIRECT_URI
        }
        headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        try:
            r = requests.post(constants.DISCORD_OAUTH2_ENDPOINT + '/token', data=data, headers=headers)
            r.raise_for_status()
        except requests.exceptions.HTTPError:
            handler.logger.exception("Couldn't post the data to Discord API.")
            handler.logger.debug(r.text)
            handler.send_error(500, "Couldn't post the data to Discord API.")
            return
        session_token = store_token(handler, r.json())
        if not session_token:
            return
        data = {
            'session_token': session_token
        }
        handler.send_json(json.dumps(data))
        return
    handler.logger.debug("No code")
    handler.send_error(401, "No code sent.")
