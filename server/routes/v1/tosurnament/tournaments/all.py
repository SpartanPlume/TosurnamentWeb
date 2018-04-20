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
    if results:
        print("GET: all: tournaments: " + str(len(results)) + " results")
        tournaments = []
        for tournament in results:
            brackets = handler.session.query(Bracket).where(Bracket.tournament_id == tournament.id).all()
            tournament.brackets = brackets
            tournaments.append(tournament)
        handler.send_array(tournaments)
    else:
        print("GET: all: tournaments: No result")
        handler.send_json("{}")

def post(handler, parameters, url_parameters, ids_parameters):
    """POST method"""
    if not parameters:
        print("POST: all: tournaments: Ignoring")
        handler.send_json("{}")
        return
    obj = Tournament()
    for key, value in parameters.items():
        if key in obj.__dict__:
            setattr(obj, key, value)
    obj = handler.session.add(obj)
    print("POST: all: tournaments: Tournament created")
    handler.send_object(obj)
