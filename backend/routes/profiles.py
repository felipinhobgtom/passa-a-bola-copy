# backend/routes/profiles.py

import os
from fastapi import APIRouter, Depends, File, UploadFile, HTTPException
from models import PlayerProfile, PlayerProfileUpdate, Media, UserInDB, ProfileMetricsResponse
from security import get_current_user
from database import player_profiles_collection, media_collection, profile_views_collection
from bson import ObjectId
import cloudinary
import cloudinary.uploader
from datetime import datetime

router = APIRouter()

# Configuração do Cloudinary
cloudinary.config(
  cloud_name = os.getenv("CLOUDINARY_CLOUD_NAME"),
  api_key = os.getenv("CLOUDINARY_API_KEY"),
  api_secret = os.getenv("CLOUDINARY_API_SECRET")
)

def get_player_user(current_user: UserInDB = Depends(get_current_user)):
    if current_user.role not in ["jogadora_amadora", "jogadora_profissional"]:
        raise HTTPException(status_code=403, detail="Acesso negado. Apenas para jogadoras.")
    return current_user

# ===============================================
# 1. ROTAS '/me' (ESPECÍFICAS) VÊM PRIMEIRO
# ===============================================

@router.get("/me", response_model=PlayerProfile)
def get_my_profile(current_user: UserInDB = Depends(get_player_user)):
    profile = player_profiles_collection.find_one({"user_id": str(current_user.id)})
    if not profile:
        raise HTTPException(status_code=404, detail="Perfil ainda não criado.")
    
    # Deixe o Pydantic (com o tipo PyObjectId) cuidar da validação e conversão
    return PlayerProfile.model_validate(profile)

@router.put("/me", response_model=PlayerProfile)
def update_my_profile(profile_data: PlayerProfileUpdate, current_user: UserInDB = Depends(get_player_user)):
    update_data = profile_data.model_dump(exclude_unset=True)
    if not update_data:
        raise HTTPException(status_code=400, detail="Nenhum dado fornecido para atualização.")
    
    if "birth_date" in update_data and update_data["birth_date"] is not None:
        update_data["birth_date"] = datetime.combine(update_data["birth_date"], datetime.min.time())
    
    player_profiles_collection.update_one(
        {"user_id": str(current_user.id)}, 
        {"$set": update_data}, 
        upsert=True
    )
    
    updated_profile = player_profiles_collection.find_one({"user_id": str(current_user.id)})
    return PlayerProfile.model_validate(updated_profile)

@router.post("/me/profile-picture", response_model=PlayerProfile)
def upload_profile_picture(file: UploadFile = File(...), current_user: UserInDB = Depends(get_player_user)):
    profile = player_profiles_collection.find_one({"user_id": str(current_user.id)})
    if not profile:
        raise HTTPException(
            status_code=404, 
            detail="Perfil não encontrado. Crie seu perfil antes de enviar uma foto."
        )

    try:
        upload_result = cloudinary.uploader.upload(file.file, resource_type="image")
        secure_url = upload_result.get("secure_url")
        if not secure_url:
            raise HTTPException(status_code=500, detail="Falha no upload da imagem.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro no serviço de upload: {e}")

    player_profiles_collection.update_one(
        {"user_id": str(current_user.id)},
        {"$set": {"image_url": secure_url}}
    )

    updated_profile = player_profiles_collection.find_one({"user_id": str(current_user.id)})
    return PlayerProfile.model_validate(updated_profile)

@router.post("/me/media", response_model=Media)
def upload_media_for_current_user(file: UploadFile = File(...), current_user: UserInDB = Depends(get_player_user)):
    profile = player_profiles_collection.find_one({"user_id": str(current_user.id)})
    if not profile:
        raise HTTPException(status_code=404, detail="Crie seu perfil antes de enviar mídias.")
    
    upload_result = cloudinary.uploader.upload(file.file, resource_type="auto")
    
    # SUGESTÃO: Armazene profile["_id"] como ObjectId, não como string
    media_data = {
        "profile_id": profile["_id"], 
        "media_type": upload_result.get("resource_type"), 
        "url": upload_result.get("secure_url")
    }
    result = media_collection.insert_one(media_data)
    new_media = media_collection.find_one({"_id": result.inserted_id})
    return Media.model_validate(new_media)

# ======================================================
# 2. ROTAS PÚBLICAS E DINÂMICAS ('/{user_id}') VÊM DEPOIS
# ======================================================

@router.get("/{user_id}", response_model=PlayerProfile)
def get_player_profile_by_id(user_id: str):
    # Valide se o user_id fornecido é um ObjectId válido para evitar erros no banco
    if not ObjectId.is_valid(user_id):
        raise HTTPException(status_code=400, detail="ID de usuário inválido.")

    profile = player_profiles_collection.find_one({"user_id": user_id})
    if not profile:
        raise HTTPException(status_code=404, detail="Perfil não encontrado.")

    # Deixe o Pydantic (com o tipo PyObjectId) cuidar da validação e conversão
    return PlayerProfile.model_validate(profile)

@router.get("/{user_id}/metrics", response_model=ProfileMetricsResponse)
def get_profile_metrics(user_id: str):
    if not ObjectId.is_valid(user_id):
        raise HTTPException(status_code=400, detail="ID de usuário inválido.")
        
    profile = player_profiles_collection.find_one({"user_id": user_id})
    if not profile:
        raise HTTPException(status_code=404, detail="Perfil não encontrado.")
    
    # SUGESTÃO: Use profile["_id"] (ObjectId) para consistência
    profile_id = profile["_id"]
    profile_views_collection.insert_one({"profile_id": profile_id, "viewed_at": datetime.now()})
    total_views = profile_views_collection.count_documents({"profile_id": profile_id})
    return ProfileMetricsResponse(view_count=total_views)

@router.get("/{user_id}/media", response_model=list[Media])
def get_profile_media(user_id: str):
    if not ObjectId.is_valid(user_id):
        raise HTTPException(status_code=400, detail="ID de usuário inválido.")

    profile = player_profiles_collection.find_one({"user_id": user_id})
    if not profile:
        raise HTTPException(status_code=404, detail="Perfil não encontrado.")
    
    # SUGESTÃO: Use profile["_id"] (ObjectId) para consistência
    media_items = list(media_collection.find({"profile_id": profile["_id"]}))
    
    # A validação do Pydantic no response_model cuidará da conversão dos IDs
    return media_items