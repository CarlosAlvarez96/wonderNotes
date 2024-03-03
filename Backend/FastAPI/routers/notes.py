from fastapi import APIRouter, HTTPException, status
from db.models.note import Note
from db.client import db_client
from bson import ObjectId

router = APIRouter(
    prefix="/notes",
    tags=["notes"],
    responses={status.HTTP_404_NOT_FOUND: {"message": "Not found"}},
)

@router.get("/", response_model=list[Note])
async def get_notes():
    return [Note(**note) for note in db_client.notes.find()]

@router.get("/{note_id}", response_model=Note)
async def get_note(note_id: str):
    return search_note("id", note_id)

@router.post("/", response_model=Note, status_code=status.HTTP_201_CREATED)
async def create_note(note: Note):
    note_dict = dict(note)
    # No elimines el campo "id"
    inserted_id = db_client.notes.insert_one(note_dict).inserted_id
    created_note = db_client.notes.find_one({"_id": inserted_id})
    return Note(**created_note)
@router.put("/{note_id}", response_model=Note)
async def update_note(note_id: str, updated_fields: dict):
    # Validar que al menos un campo ha sido proporcionado para la actualización
    if not updated_fields:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No se proporcionaron campos para la actualización",
        )

    # Actualizar solo los campos proporcionados en el diccionario `updated_fields`
    updated_note = db_client.notes.find_one_and_update(
        {"id": note_id},
        {"$set": updated_fields},
        return_document=True  # Asegúrate de obtener el documento actualizado
    )

    if not updated_note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Nota con id {note_id} no encontrada"
        )

    return Note(**updated_note)


@router.put("/{note_id}", response_model=Note)
async def update_note(note_id: str, updated_fields: dict):
    # Validar que al menos un campo ha sido proporcionado para la actualización
    if not updated_fields:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No se proporcionaron campos para la actualización",
        )

    # Actualizar solo los campos proporcionados en el diccionario `updated_fields`
    db_client.notes.find_one_and_update(
        {"id": note_id}, {"$set": updated_fields}
    )

    # Obtener la nota actualizada
    updated_note = db_client.notes.find_one({"id": note_id})
    return Note(**updated_note)

@router.delete("/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_note(note_id: str):
    db_client.notes.find_one_and_delete({"id": note_id})
    return {}

def search_note(field: str, key):
    try:
        note = db_client.notes.find_one({field: key})
        return Note(**note) if note else None
    except:
        return None
