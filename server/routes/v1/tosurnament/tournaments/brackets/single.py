"""Route to a single bracket"""

def get(handler, parameters, url_parameters, ids_parameters):
    print(parameters)
    print(url_parameters)
    [tournament_id, bracket_id] = ids_parameters
    print(tournament_id)
    print(bracket_id)
