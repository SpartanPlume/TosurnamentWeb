"""/tournaments route"""

import helpers.crypt
from routes.base import Base
from databases.bracket import Bracket
from databases.players_spreadsheet import PlayersSpreadsheet
from databases.schedules_spreadsheet import SchedulesSpreadsheet
from databases.tournament import Tournament
from databases.user import User

to_query = Tournament

class Tosurnament(Base):
    """/tournaments route handler"""
    ROUTE = "/tournaments"

    @staticmethod
    def get(handler, path):
        """GET handler"""
        if path:
            result = handler.session.query(to_query).where(to_query.server_id == helpers.crypt.hash_str(path)).first()
            if result:
                print("1 result for " + path)
                brackets = handler.session.query(Bracket).where(Bracket.tournament_id == result.id).all()
                json_brackets = []
                if brackets:
                    for bracket in brackets:
                        json_brackets.append(bracket.get_dict())
                result.brackets = json_brackets
                handler.send_object(result)
            else:
                print("No result")
                handler.send_json("{}")
        else:
            result = handler.session.query(to_query).all()
            if result:
                print(str(len(result)) + " results for all")
                handler.send_array(result)
            else:
                print("No result")
                handler.send_json("{}")

    @staticmethod
    def post(handler, path):
        """POST handler"""
        pass

    @staticmethod
    def put(handler, path, parameters):
        """PUT handler"""
        if not parameters:
            print("Ignoring")
            handler.send_json("{}")
            return
        if path:
            print(path)
            handler.session.update_columns(to_query, int(path), parameters)
            print("Tournament updated")
            handler.send_json("{}")                
        else:
            print("You need to specify an id")
            handler.send_json("{}")
