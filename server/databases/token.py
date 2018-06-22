"""Token class"""

from mysql_wrapper import Base

class Token(Base):
    """Token class"""
    __tablename__ = 'token'

    id = int()
    session_token = bytes()
    discord_user_id = bytes()
    access_token = bytes()
    token_type = bytes()
    access_token_expiry_date = bytes()
    refresh_token = bytes()
    scope = bytes()
    expiry_date = bytes()
    to_hash = ["session_token"]
    ignore = []

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
