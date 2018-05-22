"""Route to all roles"""

import requests
import constants

API_ENDPOINT = 'https://discordapp.com/api/v6'

def get(handler, parameters, url_parameters, ids_parameters):
    """GET method"""
    [guild_id] = ids_parameters
    headers = {
        'Authorization': 'Bot ' + constants.TOKEN
    }
    try:
        r = requests.get(API_ENDPOINT + '/guilds/' + guild_id + '/roles', headers=headers)
        r.raise_for_status()
    except requests.exceptions.HTTPError:
        handler.logger.exception("Couldn't get the data from Discord API.")
        handler.logger.debug(r.text)
        handler.send_error(500, "Couldn't get the data from Discord API.")
        return
    handler.send_json(r.text)

def post(handler, parameters, url_parameters, ids_parameters):
    """POST method"""
    [guild_id] = ids_parameters
    headers = {
        'Authorization': 'Bot ' + constants.TOKEN,
        'Content-Type': 'application/json'
    }
    try:
        r = requests.post(API_ENDPOINT + '/guilds/' + guild_id + '/roles', headers=headers, data=parameters)
        r.raise_for_status()
    except requests.exceptions.HTTPError:
        handler.logger.exception("Couldn't post the data to Discord API.")
        handler.logger.debug(r.text)
        handler.send_error(500, "Couldn't post the data to Discord API.")
        return
    handler.send_json(r.text)
