"""Route to all tournaments"""

from databases.tournament import Tournament
from databases.bracket import Bracket
from helpers.crypt import hash_str

def get(handler, parameters, url_parameters, ids_parameters):
    """GET method"""
    query = handler.session.query(Tournament)
    for key, values in url_parameters.items():
        if key in vars(Tournament):
            for value in values:
                query.where(getattr(Tournament, key) == hash_str(value))
    results = query.all()
    tournaments = []
    for tournament in results:
        brackets = handler.session.query(Bracket).where(Bracket.tournament_id == tournament.id).all()
        tournament.brackets = brackets
        tournaments.append(tournament)
    handler.send_object(tournaments)

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
