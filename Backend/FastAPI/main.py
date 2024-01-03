from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from routers import notes
from routers import users

app = FastAPI()

#routers 
app.include_router(notes.router)
app.include_router(users.router)
app.mount("/static", StaticFiles(directory="static"), name="static")

