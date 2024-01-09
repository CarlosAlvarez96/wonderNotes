from fastapi import APIRouter, HTTPException, status
from db.models.note import Note
from db.client import db_client
from bson import ObjectId

router = APIRouter(prefix="/notes",
                   tags=["notes"],
                   responses={status.HTTP_404_NOT_FOUND: {"message": "Not found"}})

@router.get("/", response_model=list[Note])
async def get_notes():
    return [Note(**note) for note in db_client.notes.find()]

@router.get("/{note_id}", response_model=Note)
async def get_note(note_id: str):
    return search_note("_id", ObjectId(note_id))

@router.post("/", response_model=Note, status_code=status.HTTP_201_CREATED)
async def create_note(note: Note):
    note_dict = dict(note)
    del note_dict["id"]
    inserted_id = db_client.notes.insert_one(note_dict).inserted_id
    created_note = db_client.notes.find_one({"_id": inserted_id})
    return Note(**created_note)

@router.put("/", response_model=Note)
async def update_note(note: Note):
    note_dict = dict(note)
    del note_dict["id"]
    db_client.notes.find_one_and_replace({"_id": ObjectId(note.id)}, note_dict)
    updated_note = db_client.notes.find_one({"_id": ObjectId(note.id)})
    return Note(**updated_note)

@router.delete("/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_note(note_id: str):
    db_client.notes.find_one_and_delete({"_id": ObjectId(note_id)})
    return {}

def search_note(field: str, key):
    try:
        note = db_client.notes.find_one({field: key})
        return Note(**note) if note else None
    except:
        return None
