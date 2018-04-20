"""Route to a single bracket"""

from databases.bracket import Bracket
from databases.players_spreadsheet import PlayersSpreadsheet
from databases.schedules_spreadsheet import SchedulesSpreadsheet

def get(handler, parameters, url_parameters, ids_parameters):
    """GET method"""
    [tournament_id, bracket_id] = ids_parameters
    result = handler.session.query(Bracket).where(Bracket.tournament_id == int(tournament_id)).where(Bracket.id == int(bracket_id)).first()
    if result:
        print("GET: single: brackets: 1 result for " + bracket_id)
        players_spreadsheet = handler.session.query(PlayersSpreadsheet).where(PlayersSpreadsheet.id == result.players_spreadsheet_id).first()
        schedules_spreadsheet = handler.session.query(SchedulesSpreadsheet).where(SchedulesSpreadsheet.id == result.schedules_spreadsheet_id).first()
        result.players_spreadsheet = players_spreadsheet.get_dict()
        result.schedules_spreadsheet = schedules_spreadsheet.get_dict()
        handler.send_object(result)
    else:
        print("GET: single: brackets: This bracket does not exist")
        handler.send_json("{}")

def put(handler, parameters, url_parameters, ids_parameters):
    """PUT method"""
    [tournament_id, bracket_id] = ids_parameters
    if not parameters:
        print("PUT: single: brackets: Ignoring")
        handler.send_json("{}")
        return
    result = handler.session.query(Bracket).where(Bracket.tournament_id == int(tournament_id)).where(Bracket.id == int(bracket_id)).first()
    if not result:
        print("PUT: single: brackets: This bracket does not exist")
        handler.send_json("{}")
        return
    handler.session.update_columns(Bracket, bracket_id, parameters)
    print("PUT: single: brackets: Bracket updated")
    handler.send_json("{}")   

def delete(handler, parameters, url_parameters, ids_parameters):
    """DELETE method"""
    [tournament_id, bracket_id] = ids_parameters
    result = handler.session.query(Bracket).where(Bracket.tournament_id == int(tournament_id)).where(Bracket.id == int(bracket_id)).first()
    if not result:
        print("PUT: single: brackets: This bracket does not exist")
        handler.send_json("{}")
        return
    handler.session.delete(result)
    print("DELETE: single: Bracket " + bracket_id + " deleted")
    handler.send_json("{}")
