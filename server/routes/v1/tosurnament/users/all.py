"""Route to all users"""

from databases.user import User

def get(handler, parameters, url_parameters, ids_parameters):
    """GET method"""
    results = handler.session.query(User).all()
    if results:
        print("GET: all: users: " + str(len(results)) + " results")
        handler.send_array(results)
    else:
        print("GET: all: users: No result")
        handler.send_json("{}")

def post(handler, parameters, url_parameters, ids_parameters):
    """POST method"""
    if not parameters:
        print("POST: all: users: Ignoring")
        handler.send_json("{}")
        return
    obj = User()
    for key, value in parameters.items():
        if key in obj.__dict__:
            setattr(obj, key, value)
    obj = handler.session.add(obj)
    print("POST: all: users: User created")
    handler.send_object(obj)
