"""/brackets route"""

from routes.base import Base
from databases.bracket import Bracket
from databases.players_spreadsheet import PlayersSpreadsheet
from databases.schedules_spreadsheet import SchedulesSpreadsheet
from databases.tournament import Tournament
from databases.user import User

to_query = Bracket

class Tosurnament(Base):
    """/brackets route handler"""
    ROUTE = "/brackets"

    @staticmethod
    def get(handler, path):
        """GET handler"""
        if path:
            result = handler.session.query(to_query).where(to_query.id == int(path)).first()
            if result:
                print("1 result for " + path)
                players_spreadsheet = handler.session.query(PlayersSpreadsheet).where(PlayersSpreadsheet.id == result.players_spreadsheet_id).first()
                schedules_spreadsheet = handler.session.query(SchedulesSpreadsheet).where(SchedulesSpreadsheet.id == result.schedules_spreadsheet_id).first()
                result.players_spreadsheet = players_spreadsheet.get_dict()
                result.schedules_spreadsheet = schedules_spreadsheet.get_dict()
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
    def post(handler, path, parameters):
        """POST handler"""
        if not parameters:
            print("Ignoring")
            handler.send_json("{}")
            return
        if not path:
            obj = to_query()
            for key, value in parameters.items():
                if key in obj.__dict__:
                    setattr(obj, key, value)
            obj = handler.session.add(obj)
            print("Bracket created")
            handler.send_object(obj)
        else:
            print("You need to specify an id")
            handler.send_json("{}")

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
            print("Bracket updated")
            handler.send_json("{}")                
        else:
            print("You need to specify an id")
            handler.send_json("{}")

    @staticmethod
    def delete(handler, path):
        """DELETE handler"""
        if path:
            handler.session.query(to_query).where(to_query.id == int(path)).delete()
            print("Deleted bracket " + path)
            handler.send_json("{}")
        else:
            print("Need the id of the bracket to delete")
            handler.send_json("{}")
