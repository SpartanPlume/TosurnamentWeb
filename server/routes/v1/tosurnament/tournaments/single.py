"""Route to a single tournament"""

from databases.tournament import Tournament
from databases.bracket import Bracket

def get(handler, parameters, url_parameters, ids_parameters):
    """GET method"""
    [tournament_id] = ids_parameters
    result = handler.session.query(Tournament).where(Tournament.id == int(tournament_id)).first()
    if result:
        brackets = handler.session.query(Bracket).where(Bracket.tournament_id == result.id).all()
        json_brackets = []
        if brackets:
            for bracket in brackets:
                json_brackets.append(bracket.get_dict())
        result.brackets = json_brackets
        handler.send_object(result)
    else:
        handler.logger.debug("The tournament " + tournament_id + " does not exists")
        handler.send_error(404, "This tournament does not exist")

def put(handler, parameters, url_parameters, ids_parameters):
    """PUT method"""
    [tournament_id] = ids_parameters
    if not parameters:
        handler.logger.debug("Ignoring")
        handler.send_json("{}")
        return
    result = handler.session.query(Tournament).where(Tournament.id == int(tournament_id)).first()
    if not result:
        handler.logger.debug("The tournament " + tournament_id + " does not exists")
        handler.send_error(404, "This tournament does not exist")
        return
    handler.session.update_columns(Tournament, int(tournament_id), parameters)
    handler.logger.debug("Updated succesfully")
    handler.send_json("{}")

def delete(handler, parameters, url_parameters, ids_parameters):
    """DELETE method"""
    [tournament_id] = ids_parameters
    result = handler.session.query(Tournament).where(Tournament.id == int(tournament_id)).first()
    if not result:
        handler.logger.debug("The tournament " + tournament_id + " does not exists")
        handler.send_error(404, "This tournament does not exist")
        return
    handler.session.delete(result)
    handler.logger.debug("Deleted succesfully")
    handler.send_json("{}")
