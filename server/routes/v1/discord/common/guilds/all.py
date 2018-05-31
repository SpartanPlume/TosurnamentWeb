"""Route to all common guilds between the bot and the user"""

import requests
import json
from databases.token import Token
from helpers.crypt import hash_str
import constants

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
	user_guilds = json.loads(r.text)
	bot_guilds = []
	headers = {
		'Authorization': 'Bot ' + constants.TOKEN
	}
	last_id = None
	while True:
		try:
			if last_id:
				r = requests.get(API_ENDPOINT + '/users/@me/guilds?after=' + last_id, headers=headers)
			else:
				r = requests.get(API_ENDPOINT + '/users/@me/guilds', headers=headers)
			r.raise_for_status()
		except requests.exceptions.HTTPError:
			handler.logger.exception("Couldn't get the data from Discord API.")
			handler.logger.debug(r.text)
			handler.send_error(500, "Couldn't get the data from Discord API.")
			return
		tmp_guilds = json.loads(r.text)
		if not tmp_guilds:
			break
		last_id = tmp_guilds[-1]["id"]
		bot_guilds += tmp_guilds
		if len(tmp_guilds) < 100:
			break
	common_guilds = [e for e in user_guilds for e2 in bot_guilds if e['id'] == e2['id']]
	etag = handler.get_etag(common_guilds)
	if not etag:
		handler.send_error(304)
		return
	handler.send_object(common_guilds, etag)
