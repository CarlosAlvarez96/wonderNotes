from pydantic import BaseModel, Field
from typing import Optional

class Note(BaseModel):
    id: Optional[str] = None
    user_email: str
    header: str
    body: str
    tags: Optional[list] = []

    class Config:
        allow_population_by_field_name = True
