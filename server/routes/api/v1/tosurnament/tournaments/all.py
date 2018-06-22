"""Route to all tournaments"""

import json
import requests
import constants
from databases.tournament import Tournament
from databases.bracket import Bracket
from databases.token import Token
from helpers.crypt import hash_str

API_ENDPOINT = 'https://discordapp.com/api/v6'

def get(handler, parameters, url_parameters, ids_parameters):
    """GET method"""
    query = handler.session.query(Tournament)
    guild_id = None
    for key, values in url_parameters.items():
        if key in vars(Tournament):
            for value in values:
                if key == "server_id":
                    guild_id = value
                query.where(getattr(Tournament, key) == hash_str(value))
    results = query.all()
    token = handler.session.query(Token).where(Token.session_token == hash_str(handler.session_token)).first()
    if not token:
        handler.logger.debug("Unauthorized")
        handler.send_error(401, "Unauthorized.")
        return
    headers = {
        'Authorization': 'Bot ' + constants.TOKEN
    }
    try:
        r = requests.get(API_ENDPOINT + '/guilds/' + guild_id + '/members/' + token.discord_user_id, headers=headers)
        r.raise_for_status()
    except requests.exceptions.HTTPError:
        handler.logger.exception("Couldn't get the data from Discord API.")
        handler.logger.debug(r.text)
        handler.send_error(500, "Couldn't get the data from Discord API.")
        return
    member = json.loads(r.text)
    try:
        r = requests.get(API_ENDPOINT + '/guilds/' + guild_id, headers=headers)
        r.raise_for_status()
    except requests.exceptions.HTTPError:
        handler.logger.exception("Couldn't get the data from Discord API.")
        handler.logger.debug(r.text)
        handler.send_error(500, "Couldn't get the data from Discord API.")
        return
    guild = json.loads(r.text)
    tournaments = []
    for tournament in results:
        if token.discord_user_id == guild["owner_id"] or tournament.admin_role_id in member["roles"]:
            brackets = handler.session.query(Bracket).where(Bracket.tournament_id == tournament.id).all()
            tournament.brackets = brackets
            tournaments.append(tournament)
    if not tournaments:
        handler.logger.debug("Unauthorized")
        handler.send_error(401, "Unauthorized.")
        return
    etag = handler.get_etag(tournaments)
    if not etag:
        handler.send_error(304)
        return
    handler.send_object(tournaments, etag)

def post(handler, parameters, url_parameters, ids_parameters):
    """POST method"""
    if not parameters:
        handler.logger.debug("Ignoring")
        handler.send_json("{}")
        return
    obj = Tournament()
    for key, value in parameters.items():
        if key in obj.__dict__:
            setattr(obj, key, value)
    obj = handler.session.add(obj)
    handler.logger.debug("Created successfully")
    handler.send_object(obj)
