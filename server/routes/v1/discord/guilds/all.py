"""Route to all guilds"""

import requests
from databases.token import Token
from helpers.crypt import hash_str

API_ENDPOINT = 'https://discordapp.com/api/v6'

def get(handler, parameters, url_parameters, ids_parameters):
    """GET method"""
    token = handler.session.query(Token).where(Token.session_token == hash_str(handler.session_token)).first()
    if not token:
        handler.logger.debug("Unauthorized")
        handler.send_error(401, "Unauthorized.")
        return
    headers = {
        'Authorization': 'Bearer ' + token.access_token
    }
    try:
        r = requests.get(API_ENDPOINT + '/users/@me/guilds', headers=headers)
        r.raise_for_status()
    except requests.exceptions.HTTPError:
        handler.logger.exception("Couldn't get the data from Discord API.")
        handler.logger.debug(r.text)
        handler.send_error(500, "Couldn't get the data from Discord API.")
        return
    handler.send_json(r.text)
