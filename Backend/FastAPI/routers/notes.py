from fastapi import APIRouter

router = APIRouter(prefix="/notes",
                   tags=["notes"],
                   responses={404: {"message": "Not found"}})
@router.get("/notes")
async def notes():
    return {"notas": "note1"}
