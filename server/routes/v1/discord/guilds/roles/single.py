"""Route to a single role"""

import requests
import constants

API_ENDPOINT = 'https://discordapp.com/api/v6'

def patch(handler, parameters, url_parameters, ids_parameters):
    """PATCH method"""
    [guild_id, role_id] = ids_parameters
    if not parameters:
        print("PATCH: single: roles: Ignoring")
        handler.send_json("{}")
        return
    headers = {
        'Authorization': 'Bot ' + constants.TOKEN,
        'Content-Type': 'application/json'
    }
    try:
        r = requests.patch(API_ENDPOINT + '/guilds/' + guild_id + '/roles/' + role_id, headers=headers, data=parameters)
        r.raise_for_status()
    except requests.exceptions.HTTPError as e:
        print("PATCH: single: roles: Error")
        print(e)
        print(r.json())
        handler.send_json("{}")
        return
    print("PATCH: single: roles: Success")
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
    except requests.exceptions.HTTPError as e:
        print("DELETE: single: roles: Error")
        print(e)
        print(r.json())
        handler.send_json("{}")
        return
    print("DELETE: single: roles: Success")
    handler.send_json(r.text)
