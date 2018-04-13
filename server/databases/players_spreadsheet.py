"""Players spreadsheet class"""

import re
from ast import literal_eval
from mysql_wrapper import Base
import helpers.spreadsheet

class PlayersSpreadsheet(Base):
    """Players spreadsheet class"""
    __tablename__ = 'players_spreadsheet'

    id = int()
    spreadsheet_id = bytes()
    range_team_name = bytes()
    range_team = bytes()
    incr_column = bytes()
    incr_row = bytes()
    n_team = int()
    to_hash = []
    ignore = ["n_team"]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def get_total_range_team(self):
        ranges_team = []
        if re.match(r'^\[((, )?(.+!)?[A-Z]+\d*(:[A-Z]+\d*)?)+\]$', self.range_team):
            range_team = self.range_team[1:]
            range_team = range_team[:-1]
            ranges_team = range_team.split(", ")
        else:
            ranges_team.append(self.range_team)
        return len(ranges_team)

    def get_ranges(self):
        """Gets all ranges to use to get all datas"""
        ranges_team = []
        if re.match(r'^\[((, )?(.+!)?[A-Z]+\d*(:[A-Z]+\d*)?)+\]$', self.range_team):
            range_team = self.range_team[1:]
            range_team = range_team[:-1]
            ranges_team = range_team.split(", ")
        else:
            ranges_team.append(self.range_team)
        range_names = []
        regex = re.compile(re.escape("n"), re.IGNORECASE)
        for i in range(0, self.n_team):
            incr_column = int(eval(regex.sub(str(i), self.incr_column)))
            incr_row = int(eval(regex.sub(str(i), self.incr_row)))
            if self.range_team_name.lower() != "none":
                if "!" in self.range_team_name:
                    sheet_name = self.range_team_name.split("!")[0]
                    range_team_name = self.range_team_name.split("!")[1]
                else:
                    sheet_name = ""
                    range_team_name = self.range_team_name
                cells_team_name = range_team_name.split(":")
                range_names.append(self.get_incremented_range(cells_team_name, sheet_name, incr_column, incr_row))
            for range_team in ranges_team:
                sheet_name = ""
                if "!" in range_team:
                    sheet_name = range_team.split("!")[0]
                    range_team = range_team.split("!")[1]
                cells_team = range_team.split(":")
                range_names.append(self.get_incremented_range(cells_team, sheet_name, incr_column, incr_row))
        return range_names

    def get_incremented_range(self, cells, sheet_name, incr_column, incr_row):
        """Returns a range from the incremented list of cells"""
        incremented_cells = self.increment_cells(cells, incr_column, incr_row)
        range_name = incremented_cells[0]
        if len(incremented_cells) > 1:
            range_name += ":" + incremented_cells[1]
        if sheet_name:
            range_name = sheet_name + "!" + range_name
        return range_name

    def increment_cells(self, cells, incr_column, incr_row):
        """Returns the incremented cells"""
        incremented_cells = []
        for cell in cells:
            x, y = helpers.spreadsheet.from_cell(cell)
            x += incr_column
            y += incr_row
            incremented_cells.append(helpers.spreadsheet.to_cell((x, y)))
        return incremented_cells
