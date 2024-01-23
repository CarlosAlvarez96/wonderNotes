# Clase en vídeo: https://youtu.be/_y9qQZXE24A?t=17664

### Users API con autorización OAuth2 JWT ###

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import jwt, JWTError
from passlib.context import CryptContext
from datetime import datetime, timedelta
from db.models.user import User, UserDB
from db.client import db_client


ALGORITHM = "HS256"
ACCESS_TOKEN_DURATION =  60 * 60
SECRET = "201d573bd7d1344d3a3bfce1550b69102fd11be3db6d379508b6cccc58ea230b"

router = APIRouter(prefix="/jwtauth",
                   tags=["jwtauth"],
                   responses={status.HTTP_404_NOT_FOUND: {"message": "No encontrado"}})

oauth2 = OAuth2PasswordBearer(tokenUrl="login")

crypt = CryptContext(schemes=["bcrypt"])


def search_user_db(username: str):
    user_data = db_client.users.find_one({"username": username})
    if user_data:
        return UserDB(**user_data)



def search_user(username: str):
    user_data = db_client.users.find_one({"username": username})
    if user_data:
        return User(**user_data)


async def auth_user(token: str = Depends(oauth2)):
    exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Credenciales de autenticación inválidas",
        headers={"WWW-Authenticate": "Bearer"})

    try:
        username = jwt.decode(token, SECRET, algorithms=[ALGORITHM]).get("sub")
        if username is None:
            raise exception

    except JWTError:
        raise exception

    return search_user_db(username)


async def current_user(user: UserDB = Depends(auth_user)):
    return user


@router.post("/login")
async def login(form: OAuth2PasswordRequestForm = Depends()):

    user_db = search_user_db(form.username)
    if not user_db:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="El usuario no es correcto")

    user = search_user_db(form.username)

    if not crypt.verify(form.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="La contraseña no es correcta")

    access_token = {"sub": user.username,
                    "exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_DURATION)}

    return {"access_token": jwt.encode(access_token, SECRET, algorithm=ALGORITHM), "token_type": "bearer"}


@router.post("/register", response_model=UserDB, status_code=status.HTTP_201_CREATED)
async def create_user(user: UserDB):
    # Check if the user with the given username already exists
    existing_user = search_user_db(user.username)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="El usuario ya existe")

    # Encrypt the password
    user.password = crypt.hash(user.password)

    # Save the user to the database
    user_dict = dict(user)
    del user_dict["id"]
    inserted_id = db_client.users.insert_one(user_dict).inserted_id
    created_user = db_client.users.find_one({"_id": inserted_id})

    # Return the created user
    return UserDB(**created_user)



@router.get("/users/me", response_model=UserDB)
async def me(current_user: UserDB = Depends(current_user)):
    return current_user


