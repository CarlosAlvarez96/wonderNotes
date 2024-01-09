# Clase en vídeo: https://youtu.be/_y9qQZXE24A?t=17664

### Users API con autorización OAuth2 JWT ###

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import jwt, JWTError
from passlib.context import CryptContext
from datetime import datetime, timedelta
from db.models.user import User
from db.models.user import UserDB
from db.client import db_client


ALGORITHM = "HS256"
ACCESS_TOKEN_DURATION = 100000000000000000000
SECRET = "201d573bd7d1344d3a3bfce1550b69102fd11be3db6d379508b6cccc58ea230b"

router = APIRouter(prefix="/jwtauth",
                   tags=["jwtauth"],
                   responses={status.HTTP_404_NOT_FOUND: {"message": "No encontrado"}})

oauth2 = OAuth2PasswordBearer(tokenUrl="login")

crypt = CryptContext(schemes=["bcrypt"])


# class User(BaseModel):
#     username: str
#     full_name: str
#     email: str
#     disabled: bool


# class UserDB(User):
#     password: str


# users_db = {
#     "mouredev": {
#         "username": "mouredev",
#         "full_name": "Brais Moure",
#         "email": "braismoure@mourede.com",
#         "disabled": False,
#         "password": "$2a$12$AeTUjhJdYpNlWWAqcmttlOx2gMo9cxyE8wUcao2w5opZCa5ejCKpS"
#     },
#     "mouredev2": {
#         "username": "mouredev2",
#         "full_name": "Brais Moure 2",
#         "email": "braismoure2@mourede.com",
#         "disabled": True,
#         "password": "$2a$12$8IOqtwZhFsqd25lDYkY2OOqBzEpJLHj2vwUA8p0y9J8.vyNdiJgkC"
#     }
# }


def search_user_db(username: str):
    if username in db_client:
        return UserDB(**db_client[username])


def search_user(username: str):
    if username in db_client:
        return User(**db_client[username])


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

    return search_user(username)


async def current_user(user: User = Depends(auth_user)):
    if user.disabled:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Usuario inactivo")

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


@router.get("/users/me")
async def me(user: User = Depends(current_user)):
    return user