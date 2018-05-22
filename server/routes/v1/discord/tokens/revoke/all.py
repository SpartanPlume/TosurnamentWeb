"""Route to revoke a token"""

import requests
import constants
from databases.token import Token
from helpers.crypt import hash_str

OAUTH2_ENDPOINT = 'https://discordapp.com/api/oauth2'
REDIRECT_URI = 'http://localhost:3000/api/discord/callback'

def post(handler, parameters, url_parameters, ids_parameters):
    """POST method"""
    token = handler.session.query(Token).where(Token.session_token == hash_str(handler.session_token)).first()
    if not token:
        handler.logger.debug("Invalid token")
        handler.send_json(401, "This token doesn't exist.")
        return
    headers = {
        'Authorization': 'Bearer ' + token.access_token
    }
    try:
        r = requests.post(OAUTH2_ENDPOINT + '/token/revoke', headers=headers)
        r.raise_for_status()
    except requests.exceptions.HTTPError:
        handler.logger.exception("Couldn't post the data to Discord API.")
        handler.logger.debug(r.text)
        handler.send_error(500, "Couldn't post the data to Discord API.")
        return
    handler.send_json(r.text)

