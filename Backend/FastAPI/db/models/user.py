from pydantic import BaseModel
from typing import Optional


class User(BaseModel):
    #El id es un string opcional que crea mongo automaticamente
    id: Optional[str] = None
    username: str
    email: str


class UserDB(User):
    password: str