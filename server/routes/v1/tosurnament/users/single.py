"""Route to a single user"""

from databases.user import User

def get(handler, parameters, url_parameters, ids_parameters):
    """GET method"""
    [user_id] = ids_parameters
    result = handler.session.query(User).where(User.id == int(user_id)).first()
    if result:
        etag = handler.get_etag(result)
        if not etag:
            handler.send_error(304)
            return
        handler.send_object(result, etag)
    else:
        handler.logger.debug("The user " + user_id + " does not exist")
        handler.send_error(404, "This user does not exist")

def put(handler, parameters, url_parameters, ids_parameters):
    """PUT method"""
    [user_id] = ids_parameters
    if not parameters:
        handler.logger.debug("Ignoring")
        handler.send_json("{}")
        return
    result = handler.session.query(User).where(User.id == int(user_id)).first()
    if not result:
        handler.logger.debug("The user " + user_id + " does not exist")
        handler.send_error(404, "This user does not exist")
        return
    handler.session.update_columns(User, int(user_id), parameters)
    handler.logger.debug("Updated succesfully")
    handler.send_json("{}")   

def delete(handler, parameters, url_parameters, ids_parameters):
    """DELETE method"""
    [user_id] = ids_parameters
    result = handler.session.query(User).where(User.id == int(user_id)).first()
    if not result:
        handler.logger.debug("The user " + user_id + " does not exist")
        handler.send_error(404, "This user does not exist")
        return
    handler.session.delete(result)
    handler.logger.debug("Deleted successfully")
    handler.send_json("{}")
