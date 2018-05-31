"""Route to a single bracket"""

from databases.bracket import Bracket
from databases.players_spreadsheet import PlayersSpreadsheet
from databases.schedules_spreadsheet import SchedulesSpreadsheet

def get(handler, parameters, url_parameters, ids_parameters):
    """GET method"""
    [tournament_id, bracket_id] = ids_parameters
    result = handler.session.query(Bracket).where(Bracket.tournament_id == int(tournament_id)).where(Bracket.id == int(bracket_id)).first()
    if result:
        players_spreadsheet = handler.session.query(PlayersSpreadsheet).where(PlayersSpreadsheet.id == result.players_spreadsheet_id).first()
        schedules_spreadsheet = handler.session.query(SchedulesSpreadsheet).where(SchedulesSpreadsheet.id == result.schedules_spreadsheet_id).first()
        result.players_spreadsheet = players_spreadsheet
        result.schedules_spreadsheet = schedules_spreadsheet
        etag = handler.get_etag(result)
        if not etag:
            handler.send_error(304)
            return
        handler.send_object(result, etag)
    else:
        handler.logger.debug("The bracket " + bracket_id + " does not exists")
        handler.send_error(404, "This bracket does not exist")

def put(handler, parameters, url_parameters, ids_parameters):
    """PUT method"""
    [tournament_id, bracket_id] = ids_parameters
    if not parameters:
        handler.logger.debug("Ignoring")
        handler.send_json("{}")
        return
    result = handler.session.query(Bracket).where(Bracket.tournament_id == int(tournament_id)).where(Bracket.id == int(bracket_id)).first()
    if not result:
        handler.logger.debug("The bracket " + bracket_id + " does not exists")
        handler.send_error(404, "This bracket does not exist")
        return
    handler.session.update_columns(Bracket, int(bracket_id), parameters)
    handler.logger.debug("Updated successfully")
    handler.send_json("{}")

def delete(handler, parameters, url_parameters, ids_parameters):
    """DELETE method"""
    [tournament_id, bracket_id] = ids_parameters
    result = handler.session.query(Bracket).where(Bracket.tournament_id == int(tournament_id)).where(Bracket.id == int(bracket_id)).first()
    if not result:
        handler.logger.debug("The bracket " + bracket_id + " does not exists")
        handler.send_error(404, "This bracket does not exist")
        return
    handler.session.delete(result)
    handler.logger.debug("Deleted successfully")
    handler.send_json("{}")
