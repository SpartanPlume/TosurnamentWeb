"""Route to all tournaments"""

from databases.tournament import Tournament

def get(handler, parameters, url_parameters, ids_parameters):
    """GET method"""
    result = handler.session.query(Tournament).all()
    if result:
        print("GET: all: tournaments: " + str(len(result)) + " results")
        handler.send_array(result)
    else:
        print("GET: all: tournaments: No result")
        handler.send_json("{}")

def post(handler, parameters, url_parameters, ids_parameters):
    """POST method"""
    if not parameters:
        print("POST: all: tournaments: Ignoring")
        handler.send_json("{}")
        return
    obj = Tournament()
    for key, value in parameters.items():
        if key in obj.__dict__:
            setattr(obj, key, value)
    obj = handler.session.add(obj)
    print("POST: all: tournaments: Tournament created")
    handler.send_object(obj)
