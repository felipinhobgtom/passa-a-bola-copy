# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth, players, tournaments, matches, events, suggestions, news, social_projects, profiles, feed
from database import seed_data

app = FastAPI(
    title="Passa a Bola API",
    description="Backend for the Passa a Bola project, managing players, tournaments, and users.",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Allows your Next.js frontend to connect
        "http://next_passa-a-bola:3000",  # Docker container communication
        "http://127.0.0.1:8000"  # Backend self-reference
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_db_client():
    seed_data()

# Incluir todos os roteadores
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(players.router, prefix="/api", tags=["Players"])
app.include_router(tournaments.router, prefix="/api/tournaments", tags=["Tournaments"]) 
app.include_router(matches.router, prefix="/api/matches", tags=["Matches"])    
app.include_router(events.router, prefix="/api/events", tags=["Events"])  
app.include_router(suggestions.router, prefix="/api/suggestions", tags=["Suggestions"])    
app.include_router(news.router, prefix="/api/news", tags=["News"])
app.include_router(social_projects.router, prefix="/api/social-projects", tags=["Social Projects"])
app.include_router(profiles.router, prefix="/api/profiles", tags=["Profiles"])
app.include_router(feed.router, prefix="/api/feed", tags=["Feed"])


@app.get("/")
def read_root():
    return {"message": "Welcome to the Passa a Bola API!"}