"""Route to a single tournament"""

from databases.tournament import Tournament
from databases.bracket import Bracket

def get(handler, parameters, url_parameters, ids_parameters):
    """GET method"""
    [tournament_id] = ids_parameters
    result = handler.session.query(Tournament).where(Tournament.id == int(tournament_id)).first()
    if result:
        print("GET: single: tournaments: 1 result for " + tournament_id)
        brackets = handler.session.query(Bracket).where(Bracket.tournament_id == result.id).all()
        json_brackets = []
        if brackets:
            for bracket in brackets:
                json_brackets.append(bracket.get_dict())
        result.brackets = json_brackets
        handler.send_object(result)
    else:
        print("GET: single: tournaments: This tournament does not exist")
        handler.send_error(404, "This tournament does not exist")

def put(handler, parameters, url_parameters, ids_parameters):
    """PUT method"""
    [tournament_id] = ids_parameters
    if not parameters:
        print("PUT: single: tournaments: Ignoring")
        handler.send_json("{}")
        return
    result = handler.session.query(Tournament).where(Tournament.id == int(tournament_id)).first()
    if not result:
        print("PUT: single: tournaments: This tournament does not exist")
        handler.send_error(404, "This tournament does not exist")
        return
    handler.session.update_columns(Tournament, int(tournament_id), parameters)
    print("PUT: single: tournaments: Tournament updated")
    handler.send_json("{}")

def delete(handler, parameters, url_parameters, ids_parameters):
    """DELETE method"""
    [tournament_id] = ids_parameters
    result = handler.session.query(Tournament).where(Tournament.id == int(tournament_id)).first()
    if not result:
        print("PUT: single: tournaments: This tournament does not exist")
        handler.send_error(404, "This tournament does not exist")
        return
    handler.session.delete(result)
    print("DELETE: single: tournaments: Tournament " + tournament_id + " deleted")
    handler.send_json("{}")
