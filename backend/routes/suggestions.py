from fastapi import APIRouter, HTTPException, status, Body, Depends
from models import LocationSuggestion, LocationSuggestionCreate, UserInDB
from database import suggestions_collection
from bson import ObjectId
from typing import List
from security import get_current_user
# Supondo que você tenha a função geocode_address em routes/events.py ou um arquivo de utils
from routes.events import geocode_address 

router = APIRouter()

MINIMUM_PLAYERS_TO_CONFIRM = 10

@router.post("/", response_model=LocationSuggestion)
async def suggest_location(
    suggestion_data: LocationSuggestionCreate,
    current_user: UserInDB = Depends(get_current_user)
):
    """Cria uma nova sugestão de local."""
    coordinates = await geocode_address(suggestion_data.address)
    if not coordinates:
        raise HTTPException(status_code=400, detail="Endereço inválido ou não encontrado.")

    suggestion_dict = {
        "suggested_by_user_id": str(current_user.id),
        "address": suggestion_data.address,
        "description": suggestion_data.description,
        "latitude": coordinates["latitude"],
        "longitude": coordinates["longitude"],
        "interested_user_ids": [str(current_user.id)],
        "status": "suggested"
    }
    
    result = suggestions_collection.insert_one(suggestion_dict)
    new_suggestion = suggestions_collection.find_one({"_id": result.inserted_id})
    return LocationSuggestion.model_validate(new_suggestion)

@router.post("/{suggestion_id}/interest", response_model=LocationSuggestion)
def confirm_interest(
    suggestion_id: str,
    current_user: UserInDB = Depends(get_current_user)
):
    """Confirma interesse em uma sugestão de local."""
    if not ObjectId.is_valid(suggestion_id):
        raise HTTPException(status_code=400, detail="Invalid suggestion ID")

    # Adiciona o ID do usuário à lista de interessados, se ele ainda não estiver lá
    result = suggestions_collection.find_one_and_update(
        {"_id": ObjectId(suggestion_id)},
        {"$addToSet": {"interested_user_ids": str(current_user.id)}}
    )

    if result is None:
        raise HTTPException(status_code=404, detail="Sugestão não encontrada.")
    
    # Pega o documento atualizado para verificar o número de interessados
    updated_suggestion = suggestions_collection.find_one({"_id": ObjectId(suggestion_id)})
    
    # Verifica se atingiu o número mínimo e atualiza o status
    if len(updated_suggestion["interested_user_ids"]) >= MINIMUM_PLAYERS_TO_CONFIRM:
        suggestions_collection.update_one(
            {"_id": ObjectId(suggestion_id)},
            {"$set": {"status": "confirmed"}}
        )
        # Aqui você pode adicionar lógica para enviar uma notificação
        print(f"ALERTA: A sugestão para '{updated_suggestion['address']}' atingiu o número mínimo de jogadoras!")
        updated_suggestion["status"] = "confirmed"

    return LocationSuggestion.model_validate(updated_suggestion)

# Rota get_all_suggestions
@router.get("/", response_model=List[LocationSuggestion])
def get_all_suggestions():
    suggestions = list(suggestions_collection.find({"status": "suggested"}))
    for suggestion in suggestions:
        suggestion["_id"] = str(suggestion["_id"])
    return suggestions