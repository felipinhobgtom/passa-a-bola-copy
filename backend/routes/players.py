# routes/players.py
from fastapi import APIRouter, Query
from typing import List, Optional
from models import Player
from database import players_collection
from bson import ObjectId

router = APIRouter()

# Rota get_players
@router.get("/players", response_model=List[Player])
def get_players(
    position: Optional[str] = Query(None, description="Filter by player position"),
    nationality: Optional[str] = Query(None, description="Filter by nationality")
):
    query = {}
    if position:
        query["position"] = {"$regex": position, "$options": "i"}
    if nationality:
        query["nationality"] = {"$regex": nationality, "$options": "i"}

    players_list = list(players_collection.find(query))
    for player in players_list:
        player["_id"] = str(player["_id"])
    return players_list