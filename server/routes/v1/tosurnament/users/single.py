"""Route to a single user"""

from databases.user import User

def get(handler, parameters, url_parameters, ids_parameters):
    """GET method"""
    [user_id] = ids_parameters
    result = handler.session.query(User).where(User.id == int(user_id)).first()
    if result:
        print("GET: single: users: 1 result for " + user_id)
        handler.send_object(result)
    else:
        print("GET: single: users: This user does not exist")
        handler.send_json("{}")

def put(handler, parameters, url_parameters, ids_parameters):
    """PUT method"""
    [user_id] = ids_parameters
    if not parameters:
        print("PUT: single: users: Ignoring")
        handler.send_json("{}")
        return
    result = handler.session.query(User).where(User.id == int(user_id)).first()
    if not result:
        print("PUT: single: users: This user does not exist")
        handler.send_json("{}")
        return
    handler.session.update_columns(User, int(user_id), parameters)
    print("PUT: single: users: User updated")
    handler.send_json("{}")   

def delete(handler, parameters, url_parameters, ids_parameters):
    """DELETE method"""
    [user_id] = ids_parameters
    result = handler.session.query(User).where(User.id == int(user_id)).first()
    if not result:
        print("PUT: single: users: This user does not exist")
        handler.send_json("{}")
        return
    handler.session.delete(result)
    print("DELETE: single: users: User " + user_id + " deleted")
    handler.send_json("{}")
