"""Route to a single role"""

import requests
import constants

API_ENDPOINT = 'https://discordapp.com/api/v6'

def patch(handler, parameters, url_parameters, ids_parameters):
    """PATCH method"""
    [guild_id, role_id] = ids_parameters
    if not parameters:
        handler.logger.debug("Ignoring")
        handler.send_json("{}")
        return
    headers = {
        'Authorization': 'Bot ' + constants.TOKEN,
        'Content-Type': 'application/json'
    }
    try:
        r = requests.patch(API_ENDPOINT + '/guilds/' + guild_id + '/roles/' + role_id, headers=headers, data=parameters)
        r.raise_for_status()
    except requests.exceptions.HTTPError:
        handler.logger.exception("Couldn't patch the data from Discord API.")
        handler.logger.debug(r.text)
        handler.send_error(500, "Couldn't patch the data to Discord API.")
        return
    handler.send_json(r.text)

def delete(handler, parameters, url_parameters, ids_parameters):
    """DELETE method"""
    [guild_id, role_id] = ids_parameters
    headers = {
        'Authorization': 'Bot ' + constants.TOKEN
    }
    try:
        r = requests.delete(API_ENDPOINT + '/guilds/' + guild_id + '/roles/' + role_id, headers=headers)
        r.raise_for_status()
    except requests.exceptions.HTTPError:
        handler.logger.exception("Couldn't delete the data from Discord API.")
        handler.logger.debug(r.text)
        handler.send_error(500, "Couldn't delete the data from Discord API.")
        return
    handler.send_json(r.text)
