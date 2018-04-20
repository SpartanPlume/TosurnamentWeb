"""Route to all channels"""

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
        r = requests.get(API_ENDPOINT + '/guilds/' + guild_id + '/channels', headers=headers)
        r.raise_for_status()
    except requests.exceptions.HTTPError as e:
        print("GET: all: channels: Error")
        print(e)
        print(r.json())
        handler.send_json("{}")
        return
    print("GET: all: channels: Success")
    handler.send_json(r.text)

def post(handler, parameters, url_parameters, ids_parameters):
    """POST method"""
    [guild_id] = ids_parameters
    headers = {
        'Authorization': 'Bot ' + constants.TOKEN,
        'Content-Type': 'application/json'
    }
    try:
        r = requests.post(API_ENDPOINT + '/guilds/' + guild_id + '/channels', headers=headers, data=parameters)
        r.raise_for_status()
    except requests.exceptions.HTTPError as e:
        print("POST: all: channels: Error")
        print(e)
        print(r.json())
        handler.send_json("{}")
        return
    print("POST: all: channels: Success")
    handler.send_json(r.text)
