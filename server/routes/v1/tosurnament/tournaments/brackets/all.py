"""Route to all brackets"""

from databases.bracket import Bracket

def get(handler, parameters, url_parameters, ids_parameters):
    """GET method"""
    [tournament_id] = ids_parameters
    results = handler.session.query(Bracket).where(Bracket.tournament_id == tournament_id).all()
    print("GET: all: brackets: " + str(len(results)) + " results")
    handler.send_object(results)

def post(handler, parameters, url_parameters, ids_parameters):
    """POST method"""
    [tournament_id] = ids_parameters
    if not parameters:
        print("POST: all: brackets: Ignoring")
        handler.send_json("{}")
        return
    obj = Bracket()
    for key, value in parameters.items():
        if key in obj.__dict__:
            setattr(obj, key, value)
    setattr(obj, "tournament_id", tournament_id)
    obj = handler.session.add(obj)
    print("POST: all: brackets: Bracket created")
    handler.send_object(obj)
