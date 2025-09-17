from fastapi import APIRouter, HTTPException, status, Body, Depends # 1. Adicione Depends
from models import EventCreate, EventResponse, UserInDB # 2. Importe UserInDB
from database import events_collection
from bson import ObjectId
from typing import List
import httpx
from security import get_current_admin_user # 3. Importe a função de segurança

router = APIRouter()

async def geocode_address(address: str):
    # O user-agent é importante para a política de uso do Nominatim
    headers = {"User-Agent": "PassaABolaApp/1.0"}
    async with httpx.AsyncClient() as client:
        url = f"https://nominatim.openstreetmap.org/search?q={address}&format=json&limit=1"
        response = await client.get(url, headers=headers)
        if response.status_code != 200:
            return None
        data = response.json()
        if not data:
            return None
        # Retorna a latitude e longitude do primeiro resultado
        return {"latitude": float(data[0]["lat"]), "longitude": float(data[0]["lon"])}

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=EventResponse)
async def create_event( # A função agora precisa ser 'async'
    event_data: EventCreate = Body(...),
    current_user: UserInDB = Depends(get_current_admin_user)
):
    """Cria um novo evento a partir de um endereço (Apenas para Admins)."""
    
    # 1. Converte o endereço em coordenadas
    coordinates = await geocode_address(event_data.address)
    if not coordinates:
        raise HTTPException(status_code=400, detail="Endereço não encontrado ou inválido.")

    # 2. Monta o documento completo para o banco de dados
    event_to_db = {
        "eventName": event_data.eventName,
        "date": event_data.date,
        "description": event_data.description,
        "location": {
            "address": event_data.address,
            "latitude": coordinates["latitude"],
            "longitude": coordinates["longitude"]
        }
    }
    
    # 3. Insere no banco de dados
    result = events_collection.insert_one(event_to_db)
    new_event = events_collection.find_one({"_id": result.inserted_id})
    return EventResponse.model_validate(new_event)

# Rota get_all_events
@router.get("/", response_model=List[EventResponse])
def get_all_events():
    events = list(events_collection.find())
    for event in events:
        event["_id"] = str(event["_id"])
    return events

@router.get("/{event_id}", response_model=EventResponse)
def get_event_by_id(event_id: str):
    """Busca um evento pelo seu ID."""
    if not ObjectId.is_valid(event_id):
        raise HTTPException(status_code=400, detail="Invalid event ID")
    
    event = events_collection.find_one({"_id": ObjectId(event_id)})
    if event is None:
        raise HTTPException(status_code=404, detail=f"Event with id {event_id} not found")
        
    return EventResponse.model_validate(event)

@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_event(
    event_id: str,
    current_user: UserInDB = Depends(get_current_admin_user) # Protegendo a rota de exclusão
):
    """Exclui um evento pelo seu ID (Apenas para Admins)."""
    if not ObjectId.is_valid(event_id):
        raise HTTPException(status_code=400, detail="Invalid event ID")

    result = events_collection.delete_one({"_id": ObjectId(event_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail=f"Event with id {event_id} not found")
    
    return