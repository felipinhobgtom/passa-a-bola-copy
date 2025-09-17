import os
from fastapi import APIRouter, Depends, File, UploadFile, HTTPException
from models import PlayerProfile, PlayerProfileUpdate, Media, UserInDB, ProfileMetricsResponse
from security import get_current_user
from database import player_profiles_collection, media_collection, profile_views_collection
from bson import ObjectId
import cloudinary
import cloudinary.uploader
from datetime import datetime, date

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

# == ROTAS PARA O USUÁRIO LOGADO (/me) ==
@router.put("/me", response_model=PlayerProfile)
def update_my_profile(profile_data: PlayerProfileUpdate, current_user: UserInDB = Depends(get_player_user)):
    # ... (código da função)
    update_data = profile_data.model_dump(exclude_unset=True)
    if not update_data:
        raise HTTPException(status_code=400, detail="Nenhum dado fornecido para atualização.")
    if "birth_date" in update_data and update_data["birth_date"] is not None:
        update_data["birth_date"] = datetime.combine(update_data["birth_date"], datetime.min.time())
    player_profiles_collection.update_one({"user_id": str(current_user.id)}, {"$set": update_data}, upsert=True)
    updated_profile = player_profiles_collection.find_one({"user_id": str(current_user.id)})
    return PlayerProfile.model_validate(updated_profile)

@router.get("/me", response_model=PlayerProfile)
def get_my_profile(current_user: UserInDB = Depends(get_player_user)):
    # ... (código da função)
    profile = player_profiles_collection.find_one({"user_id": str(current_user.id)})
    if not profile:
        raise HTTPException(status_code=404, detail="Perfil ainda não criado.")
    return PlayerProfile.model_validate(profile)

@router.post("/me/media", response_model=Media)
def upload_media_for_current_user(file: UploadFile = File(...), current_user: UserInDB = Depends(get_player_user)):
    # ... (código da função)
    profile = player_profiles_collection.find_one({"user_id": str(current_user.id)})
    if not profile:
        raise HTTPException(status_code=404, detail="Crie seu perfil antes de enviar mídias.")
    upload_result = cloudinary.uploader.upload(file.file, resource_type="auto")
    media_data = {"profile_id": str(profile["_id"]), "media_type": upload_result.get("resource_type"), "url": upload_result.get("secure_url")}
    result = media_collection.insert_one(media_data)
    new_media = media_collection.find_one({"_id": result.inserted_id})
    return Media.model_validate(new_media)


# ====== ROTAS PÚBLICAS (ORDEM CORRETA) ======

# Rota mais específica primeiro
@router.get("/{user_id}/metrics", response_model=ProfileMetricsResponse)
def get_profile_metrics(user_id: str):
    # Esta rota pode continuar como está, mas vamos padronizar o nome do parâmetro
    profile = player_profiles_collection.find_one({"user_id": user_id})
    if not profile:
        raise HTTPException(status_code=404, detail="Perfil não encontrado para registrar métrica.")
    
    profile_id_str = str(profile["_id"])
    profile_views_collection.insert_one({"profile_id": profile_id_str, "viewed_at": datetime.now()})
    total_views = profile_views_collection.count_documents({"profile_id": profile_id_str})
    return ProfileMetricsResponse(view_count=total_views)

# Rota get_profile_media
@router.get("/{user_id}/media", response_model=list[Media])
def get_profile_media(user_id: str):
    profile = player_profiles_collection.find_one({"user_id": user_id})
    if not profile:
        raise HTTPException(status_code=404, detail="Perfil não encontrado.")
    
    media_items = list(media_collection.find({"profile_id": str(profile["_id"])}))
    for item in media_items:
        item["_id"] = str(item["_id"])
    return media_items

@router.get("/{user_id}", response_model=PlayerProfile)
def get_player_profile_by_id(user_id: str):
    """Busca um perfil de jogadora público pelo seu ID de USUÁRIO."""
    # Buscamos o perfil pelo user_id
    profile = player_profiles_collection.find_one({"user_id": user_id})
    if not profile:
        raise HTTPException(status_code=404, detail="Perfil não encontrado.")
        
    return PlayerProfile.model_validate(profile)

@router.post("/me/profile-picture", response_model=PlayerProfile)
def upload_profile_picture(
    file: UploadFile = File(...),
    current_user: UserInDB = Depends(get_player_user)
):
    """Faz upload de uma foto e a define como a foto de perfil da jogadora."""
    # Faz o upload para o Cloudinary
    upload_result = cloudinary.uploader.upload(file.file, resource_type="image")
    secure_url = upload_result.get("secure_url")

    if not secure_url:
        raise HTTPException(status_code=500, detail="Falha no upload da imagem para o serviço externo.")

    # Atualiza o campo 'image_url' no documento do perfil da jogadora
    player_profiles_collection.update_one(
        {"user_id": str(current_user.id)},
        {"$set": {"image_url": secure_url}},
        upsert=True # Cria o perfil se não existir
    )

    updated_profile = player_profiles_collection.find_one({"user_id": str(current_user.id)})
    return PlayerProfile.model_validate(updated_profile)
