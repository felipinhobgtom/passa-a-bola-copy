from fastapi import APIRouter, Depends, Body, HTTPException, status
from typing import List
from models import SocialProject, SocialProjectCreate, UserInDB
from database import social_projects_collection
from security import get_current_admin_user, get_current_user
from bson import ObjectId

router = APIRouter()

@router.post("/", response_model=SocialProject, status_code=status.HTTP_201_CREATED)
def create_social_project(
    project_data: SocialProjectCreate,
    current_user: UserInDB = Depends(get_current_admin_user)
):
    """Cria um novo projeto social (Apenas para Admins)."""
    project_dict = project_data.model_dump()
    result = social_projects_collection.insert_one(project_dict)
    new_project = social_projects_collection.find_one({"_id": result.inserted_id})
    return SocialProject.model_validate(new_project)

# Rota get_all_social_projects
@router.get("/", response_model=List[SocialProject])
def get_all_social_projects(current_user: UserInDB = Depends(get_current_user)):
    projects = list(social_projects_collection.find())
    for project in projects:
        project["_id"] = str(project["_id"])
    return projects