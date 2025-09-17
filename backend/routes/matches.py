# routes/matches.py
from fastapi import APIRouter, HTTPException, status, Body, Query, Depends
from models import MatchCreate, MatchResponse, UserInDB
from database import matches_collection, tournaments_collection
from bson import ObjectId
from typing import List
from security import get_current_admin_user
from datetime import datetime

router = APIRouter()

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=MatchResponse)
def create_match(
    match: MatchCreate = Body(...),
    current_user: UserInDB = Depends(get_current_admin_user) # Route is correctly protected
):
    """Creates a new match (Admins Only)."""
    if not ObjectId.is_valid(match.tournament_id) or \
       tournaments_collection.count_documents({"_id": ObjectId(match.tournament_id)}) == 0:
        raise HTTPException(status_code=404, detail=f"Tournament with id {match.tournament_id} not found.")

    match_dict = match.model_dump()
    
        
    result = matches_collection.insert_one(match_dict)
    new_match = matches_collection.find_one({"_id": result.inserted_id})

    # **CORRECTION: Convert ObjectId to string before validation**
    if new_match:
        return MatchResponse.model_validate(new_match)
    
    raise HTTPException(status_code=500, detail="Failed to create and retrieve the match.")

# Rota get_all_matches
@router.get("/", response_model=List[MatchResponse])
def get_all_matches(tournament_id: str = Query(None, description="Filtra os jogos por ID do torneio")):
    query = {}
    if tournament_id:
        if not ObjectId.is_valid(tournament_id):
            raise HTTPException(status_code=400, detail="Invalid tournament ID")
        query["tournament_id"] = tournament_id
    
    matches = list(matches_collection.find(query))
    for match in matches:
        match["_id"] = str(match["_id"])
    return matches

@router.get("/{match_id}", response_model=MatchResponse)
def get_match_by_id(match_id: str):
    """Fetches a match by its ID."""
    if not ObjectId.is_valid(match_id):
        raise HTTPException(status_code=400, detail="Invalid match ID")
        
    match = matches_collection.find_one({"_id": ObjectId(match_id)})
    if match is None:
        raise HTTPException(status_code=404, detail=f"Match with id {match_id} not found")
    
    return MatchResponse.model_validate(match)

@router.delete("/{match_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_match(
    match_id: str,
    current_user: UserInDB = Depends(get_current_admin_user) # Route is correctly protected
):
    """Deletes a match by its ID (Admins Only)."""
    if not ObjectId.is_valid(match_id):
        raise HTTPException(status_code=400, detail="Invalid match ID")

    result = matches_collection.delete_one({"_id": ObjectId(match_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail=f"Match with id {match_id} not found")
    
    return