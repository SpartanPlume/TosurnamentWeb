"""Spreadsheet utilities functions"""

def from_cell(cell):
    coordinates = re.split('(\d+)', cell)
    x = int(coordinates[0], 36) - 10
    if len(coordinates) == 1:
        y = -1
    else:
        y = int(coordinates[1]) - 1
    return (x, y)

def to_cell(coordinates):
    x, y = coordinates
    cell = to_base(x, "ABCDEFGHIJKLMNOPQRSTUVWXYZ")
    if y >= 0:
        cell += str(y + 1)
    return (cell)