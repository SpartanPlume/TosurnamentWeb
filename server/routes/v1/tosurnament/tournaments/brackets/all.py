"""Route to all brackets"""

from databases.bracket import Bracket

def get(handler, parameters, url_parameters, ids_parameters):
    """GET method"""
    [tournament_id] = ids_parameters
    result = handler.session.query(Bracket).where(Bracket.tournament_id == tournament_id).all()
    if result:
        print("GET: all: brackets: " + str(len(result)) + " results")
        handler.send_array(result)
    else:
        print("GET: all: brackets: No result")
        handler.send_json("{}")

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
