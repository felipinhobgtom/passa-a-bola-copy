import httpx
import os
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from models import Article, UserInDB
from database import news_collection
from security import get_current_user
from bson import ObjectId
from dotenv import load_dotenv

load_dotenv()
router = APIRouter()
NEWS_API_KEY = os.getenv("NEWS_API_KEY")

@router.get("", response_model=List[Article])
async def get_and_store_articles(current_user: UserInDB = Depends(get_current_user)):
    """
    Busca notícias da API externa, salva no DB se forem novas,
    e retorna a lista completa do nosso DB.
    """
    if not NEWS_API_KEY:
        raise HTTPException(status_code=500, detail="Chave da API de notícias não configurada.")

    query = '"futebol feminino" OR "women\'s soccer"'
    url = f"https://newsapi.org/v2/everything?q={query}&language=pt&sortBy=publishedAt&apiKey={NEWS_API_KEY}"

    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url)
            response.raise_for_status()
            data = response.json()
            articles_from_api = data.get("articles", [])

            # Salva artigos novos no banco de dados
            for article_data in articles_from_api:
                # Verifica se o artigo já existe pela URL
                if article_data.get("url") and not news_collection.find_one({"url": article_data["url"]}):
                    news_collection.insert_one(article_data)

        except Exception as e:
            print(f"Erro ao buscar da NewsAPI: {e}")
            # Se a API externa falhar, ainda tentamos servir o que temos no cache do DB
    
    # Retorna todos os artigos do nosso banco de dados, ordenados
    all_articles_from_db = list(news_collection.find().sort("published_at", -1))
    for article in all_articles_from_db:
        article["_id"] = str(article["_id"])
    return all_articles_from_db

@router.get("/{article_id}", response_model=Article)
def get_article_by_id(article_id: str, current_user: UserInDB = Depends(get_current_user)):
    """Busca um único artigo do nosso banco de dados pelo seu ID."""
    if not ObjectId.is_valid(article_id):
        raise HTTPException(status_code=400, detail="Invalid article ID")
    
    article = news_collection.find_one({"_id": ObjectId(article_id)})
    if article is None:
        raise HTTPException(status_code=404, detail="Artigo não encontrado.")
        
    return Article.model_validate(article)