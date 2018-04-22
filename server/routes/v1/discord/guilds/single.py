"""Route to a single guild"""

import requests
import constants
from databases.token import Token
from helpers.crypt import hash_str

API_ENDPOINT = 'https://discordapp.com/api/v6'

def get(handler, parameters, url_parameters, ids_parameters):
    """GET method"""
    [guild_id] = ids_parameters
    headers = {
        'Authorization': 'Bot ' + constants.TOKEN
    }
    try:
        r = requests.get(API_ENDPOINT + '/guilds/' + guild_id, headers=headers)
        r.raise_for_status()
    except requests.exceptions.HTTPError as e:
        print("GET: single: guilds: Error")
        print(e)
        print(r.json())
        handler.send_error(500, "Couldn't get the data from Discord API.")
        return
    print("GET: single: guilds: Success")
    handler.send_json(r.text)
