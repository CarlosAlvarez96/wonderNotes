from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/users",
                   tags=["users"],
                   responses={404: {"message": "User not found"}})

# Entidad user
class User(BaseModel):
    id: int
    name: str
    password: str
    email: str

my_users = [User(id=1, name="Juan", password="123", email="juan@example.com"),
            User(id=2, name="Pedro", password="456", email="pedro@example.com"),
            User(id=3, name="Jose", password="789", email="jose@example.com")]

@router.get("/users")
async def get_users():
    return my_users

@router.get("/users/{id}")
async def get_user(id: int):
    return search_user(id)

@router.post("/users")
async def create_user(user: User):
    if search_user(user.id):
        return {"error": "User already exists"}
    else:
        my_users.append(user)
        return user

@router.put("/users")
async def update_user(user: User):
    for index, saved_user in enumerate(my_users):
        if saved_user.id == user.id:
            my_users[index] = user
            return user

@router.delete("/users/{id}")
async def delete_user(id: int):
    for index, saved_user in enumerate(my_users):
        if saved_user.id == id:
            del my_users[index]
            return {"message": "User deleted"}

def search_user(id: int):
    try:
        user = next(u for u in my_users if u.id == id)
        return user
    except StopIteration:
        return None
