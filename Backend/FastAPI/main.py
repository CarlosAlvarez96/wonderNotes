import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from routers import users, notes, jwt_auth_users, users_db

app = FastAPI()

#routers 
app.include_router(notes.router)
app.include_router(users.router)
app.include_router(jwt_auth_users.router)
app.include_router(users_db.router)


app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
async def root():
    return "Hola FastAPI!"

# Url local: http://127.0.0.1:8000/url


@app.get("/url")
async def url():
    return {"url": "https://mouredev.com/python"}

# Inicia el server: uvicorn main:app --reload
# Detener el server: CTRL+C

# Documentación con Swagger: http://127.0.0.1:8000/docs
# Documentación con Redocly: http://127.0.0.1:8000/redoc