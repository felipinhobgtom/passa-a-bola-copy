# database.py
from pymongo import MongoClient
import os
from datetime import datetime, timedelta

# It's better to use environment variables for sensitive data
MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://murilogbc2006_db_user:enhYHzrjyYmFfPqm@passabola.p9yuss2.mongodb.net/?retryWrites=true&w=majority&appName=PassaBola")
DB_NAME = "PassaBolaDB"

client = MongoClient(MONGO_URI)
db = client[DB_NAME]

# Collections
users_collection = db.users
players_collection = db.players
tournaments_collection = db.tournaments
events_collection = db.events
matches_collection = db.matches
suggestions_collection = db.suggestions
news_collection = db.news
social_projects_collection = db.social_projects
player_profiles_collection = db.player_profiles
media_collection = db.media
profile_views_collection = db.profile_views
posts_collection = db.posts
comments_collection = db.comments
teams_collection = db.teams

# You can add some mock data here for testing if the collections are empty
def seed_data():
    """Popula a base de dados com dados iniciais se as coleções estiverem vazias."""
    
    # Adicionar Torneios de Exemplo
    if tournaments_collection.count_documents({}) == 0:
        sample_tournaments = [
            {
                "name": "Copa Rainhas da Várzea 2025",
                "description": "A maior competição de futebol feminino amador de São Paulo está de volta!",
                "start_date": datetime.now(),
                "end_date": datetime.now() + timedelta(days=30),
                "location": "São Paulo, SP",
                "registration_open": True,
                "teams": []
            },
            {
                "name": "Torneio Futuro das Craques (Sub-17)",
                "description": "Revelando os novos talentos do futebol feminino de base.",
                "start_date": datetime.now() + timedelta(days=60),
                "end_date": datetime.now() + timedelta(days=75),
                "location": "Rio de Janeiro, RJ",
                "registration_open": False,
                "teams": []
            }
        ]
        tournaments_collection.insert_many(sample_tournaments)
        print("Base de dados populada com torneios de exemplo.")

    # Adicionar Projetos Sociais de Exemplo
    if social_projects_collection.count_documents({}) == 0:
        sample_projects = [
            {
                "name": "Daminhas da Bola",
                "description": "Um projeto que utiliza o futebol para empoderar meninas em comunidades carentes, promovendo educação e esporte.",
                "location": "Salvador, BA",
                "website_url": "https://www.example.com",
                "image_url": "https://res.cloudinary.com/deu9ofh6j/image/upload/v1757998451/gx1zdtbl4av92rzz3suc.jpg" # URL de exemplo
            }
        ]
        social_projects_collection.insert_many(sample_projects)
        print("Base de dados populada com projetos sociais de exemplo.")
