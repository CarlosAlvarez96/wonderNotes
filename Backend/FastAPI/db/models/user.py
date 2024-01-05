from pydantic import BaseModel
from typing import Optional


class User(BaseModel):
    #El id es un string opciona que crea mongo automaticamente
    id: Optional[str] = None
    username: str
    email: str
