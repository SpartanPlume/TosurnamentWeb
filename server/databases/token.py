"""Token class"""

from mysql_wrapper import Base

class Token(Base):
    """Token class"""
    __tablename__ = 'token'

    id = int()
    session_token = bytes()
    access_token = bytes()
    token_type = bytes()
    expires_in = int()
    refresh_token = bytes()
    scope = bytes()
    expiry_date = bytes()
    to_hash = ["session_token"]
    ignore = ["expires_in"]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
