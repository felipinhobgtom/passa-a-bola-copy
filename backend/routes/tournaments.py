from fastapi import APIRouter, HTTPException, status, Body, Depends
from models import TournamentCreate, TournamentResponse, UserInDB, Team, TeamCreate
from database import tournaments_collection, teams_collection
from bson import ObjectId
from typing import List
from security import get_current_admin_user

router = APIRouter()

@router.post("", status_code=status.HTTP_201_CREATED, response_model=TournamentResponse)
def create_tournament(
    tournament: TournamentCreate = Body(...),
    current_user: UserInDB = Depends(get_current_admin_user)
):
    """Creates a new tournament (Admins Only)."""
    tournament_dict = tournament.model_dump(by_alias=True)
    result = tournaments_collection.insert_one(tournament_dict)
    new_tournament = tournaments_collection.find_one({"_id": result.inserted_id})
    
    # This check is crucial to prevent errors if the insert somehow fails to be found
    if new_tournament:
        return TournamentResponse.model_validate(new_tournament)
    raise HTTPException(status_code=500, detail="Failed to create and retrieve tournament.")

@router.get("", response_model=List[TournamentResponse])
def get_all_tournaments():
    tournaments = list(tournaments_collection.find())
    for tournament in tournaments:
        tournament["_id"] = str(tournament["_id"])
    return tournaments

@router.get("/{tournament_id}", response_model=TournamentResponse)
def get_tournament_by_id(tournament_id: str):
    """Fetches a tournament by its ID."""
    if not ObjectId.is_valid(tournament_id):
        raise HTTPException(status_code=400, detail="Invalid tournament ID")
        
    tournament = tournaments_collection.find_one({"_id": ObjectId(tournament_id)})
    if tournament is None:
        raise HTTPException(status_code=404, detail=f"Tournament with id {tournament_id} not found")

    return TournamentResponse.model_validate(tournament)

@router.delete("/{tournament_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_tournament(
    tournament_id: str,
    current_user: UserInDB = Depends(get_current_admin_user)
):
    """Deletes a tournament by its ID (Admins Only)."""
    if not ObjectId.is_valid(tournament_id):
        raise HTTPException(status_code=400, detail="Invalid tournament ID")

    result = tournaments_collection.delete_one({"_id": ObjectId(tournament_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail=f"Tournament with id {tournament_id} not found")
    
    return

@router.get("/{tournament_id}/teams", response_model=List[Team])
def get_teams_in_tournament(tournament_id: str):
    if not ObjectId.is_valid(tournament_id):
        raise HTTPException(status_code=400, detail="Invalid tournament ID")

    teams = list(teams_collection.find({"tournament_id": tournament_id}))
    for team in teams:
        team["_id"] = str(team["_id"])
    return teams

@router.post("/{tournament_id}/teams", response_model=Team, status_code=status.HTTP_201_CREATED)
def create_team_for_tournament(
    tournament_id: str,
    team_data: TeamCreate,
    current_user: UserInDB = Depends(get_current_admin_user)
):
    """Creates and adds a new team to a tournament."""
    if not ObjectId.is_valid(tournament_id):
        raise HTTPException(status_code=400, detail="Invalid tournament ID")
    
    if tournaments_collection.count_documents({"_id": ObjectId(tournament_id)}) == 0:
        raise HTTPException(status_code=404, detail="Tournament not found")

    team_dict = team_data.model_dump(by_alias=True)
    team_dict["tournament_id"] = tournament_id
    team_dict["players"] = []
    team_dict["captain_id"] = str(current_user.id)
    
    result = teams_collection.insert_one(team_dict)
    new_team = teams_collection.find_one({"_id": result.inserted_id})
    
    if new_team:
        return Team.model_validate(new_team)
    raise HTTPException(status_code=500, detail="Failed to create and retrieve team.")