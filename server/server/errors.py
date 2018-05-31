"""All possible errors of the server"""

ERRORS = {
    304: "Not Modified",
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    405: "Method Not Allowed",
    429: "Too Many Requests",
    500: "Internal Server Error"
}

def get_json_from_error(error_code, description = ""):
    return {
        "error": {
            "status": error_code,
            "message": ERRORS[error_code],
            "description": description
        }
    }