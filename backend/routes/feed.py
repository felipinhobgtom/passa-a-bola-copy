from fastapi import APIRouter, Depends, Form, File, UploadFile, HTTPException, status
from typing import List
from models import Post, PostCreate, PostInFeed, UserInDB, Comment, CommentCreate
from database import posts_collection, player_profiles_collection
from security import get_current_user
from bson import ObjectId
import cloudinary
import cloudinary.uploader
import os
from routes.profiles import get_player_user

cloudinary.config(
  cloud_name = os.getenv("CLOUDINARY_CLOUD_NAME"),
  api_key = os.getenv("CLOUDINARY_API_KEY"),
  api_secret = os.getenv("CLOUDINARY_API_SECRET")
)

router = APIRouter()

@router.post("/posts", response_model=Post)
def create_post(
    content: str = Form(...),
    file: UploadFile = File(None),
    current_user: UserInDB = Depends(get_player_user)
):
    """Cria uma nova postagem, com suporte a upload de imagem."""
    profile = player_profiles_collection.find_one({"user_id": str(current_user.id)})
    if not profile:
        raise HTTPException(status_code=403, detail="A jogadora precisa ter um perfil criado para postar.")

    image_url = None
    if file:
        upload_result = cloudinary.uploader.upload(file.file, resource_type="image")
        image_url = upload_result.get("secure_url")

    post_dict = {
        "author_profile_id": str(profile["_id"]),
        "content": content,
        "image_url": image_url
    }
    
    result = posts_collection.insert_one(post_dict)
    new_post = posts_collection.find_one({"_id": result.inserted_id})
    return Post.model_validate(new_post)


@router.get("/", response_model=List[PostInFeed])
def get_feed(current_user: UserInDB = Depends(get_current_user)):
    """Busca as postagens para o feed, incluindo informações do autor."""
    pipeline = [
        {"$sort": {"created_at": -1}},
        {"$addFields": {
            "author_profile_obj_id": {"$toObjectId": "$author_profile_id"}
        }},
        {"$lookup": {
            "from": "player_profiles",
            "localField": "author_profile_obj_id",
            "foreignField": "_id",
            "as": "author_details"
        }},
        {"$unwind": "$author_details"},
        {"$project": {
            "_id": 1,
            "author_profile_id": 1,
            "content": 1,
            "image_url": 1,
            "created_at": 1,
            "likes": 1,
            "author_name": "$author_details.full_name",
            "author_image_url": "$author_details.image_url",
            "author_user_id": "$author_details.user_id"
        }}
    ]
    
    feed_items = list(posts_collection.aggregate(pipeline))
    
    # Convert ObjectId to string for each item
    for item in feed_items:
        item['_id'] = str(item['_id'])
    
    return [PostInFeed.model_validate(item) for item in feed_items]

@router.post("/posts/{post_id}/like", status_code=status.HTTP_204_NO_CONTENT)
def toggle_like_post(post_id: str, current_user: UserInDB = Depends(get_current_user)):
    """Adiciona ou remove o like de um usuário em um post."""
    if not ObjectId.is_valid(post_id):
        raise HTTPException(status_code=400, detail="ID de post inválido")

    post = posts_collection.find_one({"_id": ObjectId(post_id)})
    if not post:
        raise HTTPException(status_code=404, detail="Post não encontrado")

    user_id_str = str(current_user.id)
    
    # Verifica se o usuário já curtiu o post
    if user_id_str in post.get("likes", []):
        # Se já curtiu, remove o like (unlike)
        posts_collection.update_one(
            {"_id": ObjectId(post_id)},
            {"$pull": {"likes": user_id_str}}
        )
    else:
        # Se não curtiu, adiciona o like
        posts_collection.update_one(
            {"_id": ObjectId(post_id)},
            {"$addToSet": {"likes": user_id_str}} # $addToSet previne duplicados
        )
    
    return

@router.post("/posts/{post_id}/comments", response_model=Comment)
def create_comment_for_post(
    post_id: str,
    comment_data: CommentCreate,
    current_user: UserInDB = Depends(get_current_user)
):
    """Cria um novo comentário para um post."""
    if not ObjectId.is_valid(post_id):
        raise HTTPException(status_code=400, detail="ID de post inválido")

    if not posts_collection.find_one({"_id": ObjectId(post_id)}):
        raise HTTPException(status_code=404, detail="Post não encontrado")
    
    profile = player_profiles_collection.find_one({"user_id": str(current_user.id)})
    author_name = profile.get("full_name") if profile else "Usuária"

    comment_dict = {
        "post_id": post_id,
        "author_id": str(current_user.id),
        "author_name": author_name,
        "content": comment_data.content
    }
    
    # LÓGICA CORRIGIDA ABAIXO
    from database import comments_collection
    # 1. Insere o novo comentário no banco de dados
    result = comments_collection.insert_one(comment_dict)
    
    # 2. Busca o comentário que acabou de ser inserido
    new_comment = comments_collection.find_one({"_id": result.inserted_id})
    
    # 3. Converte o _id para string e valida o novo comentário antes de retornar
    if new_comment:
        new_comment["_id"] = str(new_comment["_id"])
        
    return Comment.model_validate(new_comment)

@router.get("/posts/{post_id}/comments", response_model=List[Comment])
def get_comments_for_post(post_id: str, current_user: UserInDB = Depends(get_current_user)):
    """Busca todos os comentários de um post específico."""
    if not ObjectId.is_valid(post_id):
        raise HTTPException(status_code=400, detail="ID de post inválido")
        
    from database import comments_collection
    comments = list(comments_collection.find({"post_id": post_id}).sort("created_at", 1))
    
    # Valida cada comentário individualmente após converter o _id
    validated_comments = []
    for c in comments:
        c["_id"] = str(c["_id"])
        validated_comments.append(Comment.model_validate(c))
        
    return validated_comments