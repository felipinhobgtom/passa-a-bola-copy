from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import List, Optional, Any
from datetime import datetime, date
from bson import ObjectId
from enum import Enum
from pydantic_core import core_schema


# Helper para ObjectId (Versão Corrigida para Pydantic v2)

class PyObjectId(ObjectId):
    @classmethod
    def __get_pydantic_core_schema__(cls, source: Any, handler: Any) -> core_schema.CoreSchema:
        def validate_object_id(v):
            if isinstance(v, ObjectId):
                return v
            if isinstance(v, str) and ObjectId.is_valid(v):
                return ObjectId(v)
            raise ValueError("Invalid ObjectId")

        return core_schema.no_info_after_validator_function(
            validate_object_id,
            core_schema.str_schema(),
            serialization=core_schema.to_string_ser_schema(),
        )


# Enum para User Roles
class UserRole(str, Enum):
    TORCEDOR = "torcedor"
    JOGADORA_AMADORA = "jogadora_amadora"
    JOGADORA_PROFISSIONAL = "jogadora_profissional"
    OLHEIRO = "olheiro"
    ADMIN = "admin"

# --- User and Auth Models ---
class UserCreate(BaseModel):
    email: EmailStr
    senha: str
    role: UserRole

class UserResponse(BaseModel):
    id: PyObjectId = Field(alias="_id")
    email: EmailStr
    model_config = ConfigDict(
        json_encoders={ObjectId: str},
        populate_by_name=True,
        arbitrary_types_allowed=True,
    )
        
class UserInDB(UserResponse):
    hashed_password: str
    role: UserRole

# --- Player Models ---
class Player(BaseModel):
    id: PyObjectId = Field(alias="_id")
    name: str
    age: int
    position: str
    team: str
    nationality: str
    class Config:
        json_encoders = {ObjectId: str}
        populate_by_name = True
        arbitrary_types_allowed = True

# --- Tournament Models ---
class TournamentBase(BaseModel):
    name: str
    description: Optional[str] = None
    teams: List[str] = Field(default_factory=list)

class TournamentCreate(TournamentBase):
    pass

class TournamentResponse(TournamentBase):
    id: PyObjectId = Field(alias="_id")
    class Config:
        json_encoders = {ObjectId: str}
        populate_by_name = True
        arbitrary_types_allowed = True

# --- Match Models ---
class GoalDetail(BaseModel):
    player_id: str
    minute_scored: int

class MatchBase(BaseModel):
    tournament_id: str
    match_date: datetime
    team_a_name: str
    team_b_name: str
    team_a_score: int = 0
    team_b_score: int = 0
    status: str = "scheduled"
    lineup_a: List[str] = Field(default_factory=list)
    lineup_b: List[str] = Field(default_factory=list)
    goals: List[GoalDetail] = Field(default_factory=list)

class MatchCreate(MatchBase):
    pass

class MatchResponse(MatchBase):
    id: PyObjectId = Field(alias="_id")
    class Config:
        json_encoders = {ObjectId: str}
        populate_by_name = True
        arbitrary_types_allowed = True

# --- Event Models (Versão Correta para Geocoding) ---
class Location(BaseModel):
    address: str
    latitude: float
    longitude: float

class EventBase(BaseModel):
    eventName: str
    date: datetime
    location: Location
    description: Optional[str] = None

class EventCreate(BaseModel):
    eventName: str
    date: datetime
    address: str
    description: Optional[str] = None

class EventResponse(EventBase):
    id: PyObjectId = Field(alias="_id")
    class Config:
        json_encoders = {ObjectId: str}
        populate_by_name = True
        arbitrary_types_allowed = True

class LocationSuggestion(BaseModel):
    id: PyObjectId = Field(alias="_id", default=None)
    suggested_by_user_id: str
    address: str
    latitude: float
    longitude: float
    description: Optional[str] = None
    interested_user_ids: List[str] = Field(default_factory=list)
    status: str = "suggested"  # Estados: suggested, confirmed, event_created
    created_at: datetime = Field(default_factory=datetime.now)

class LocationSuggestionCreate(BaseModel):
    address: str
    description: Optional[str] = None

class Team(BaseModel):
    id: PyObjectId = Field(alias="_id", default=None)
    name: str
    tournament_id: str
    captain_id: str
    player_ids: List[str] = Field(default_factory=list)

class QueueEntry(BaseModel):
    user_id: str
    tournament_id: str
    team_id: Optional[str] = None # Fila para time específico ou geral
    queued_at: datetime = Field(default_factory=datetime.now)

# Atualizar o modelo TournamentBase
class TournamentBase(BaseModel):
    # ... campos existentes
    registration_open: bool = False
    max_teams: int
    max_players_per_team: int

class LocationSuggestion(BaseModel):
    id: PyObjectId = Field(alias="_id", default=None)
    suggested_by_user_id: str
    address: str
    latitude: float
    longitude: float
    description: Optional[str] = None
    interested_user_ids: List[str] = Field(default_factory=list)
    status: str = "suggested"
    created_at: datetime = Field(default_factory=datetime.now)

    class Config:
        json_encoders = {ObjectId: str}
        populate_by_name = True
        arbitrary_types_allowed = True

class LocationSuggestionCreate(BaseModel):
    address: str
    description: Optional[str] = None

class Article(BaseModel):
    id: PyObjectId = Field(alias="_id", default=None)
    title: str
    content: str
    author: str
    image_url: Optional[str] = None
    published_at: datetime = Field(default_factory=datetime.now)
    tags: List[str] = Field(default_factory=list)

    class Config:
        json_encoders = {ObjectId: str}
        populate_by_name = True
        arbitrary_types_allowed = True

class ArticleCreate(BaseModel):
    title: str
    content: str
    author: str
    image_url: Optional[str] = None
    tags: List[str] = Field(default_factory=list)

# Verifique se seu modelo Article está assim:
class Article(BaseModel):
    id: PyObjectId = Field(alias="_id", default=None)
    title: Optional[str] = None
    description: Optional[str] = None
    author: Optional[str] = None
    url: str
    image_url: Optional[str] = Field(None, alias='urlToImage')
    published_at: datetime = Field(..., alias='publishedAt')
    content: Optional[str] = None # Campo para o conteúdo completo

    class Config:
        json_encoders = {ObjectId: str}
        populate_by_name = True
        arbitrary_types_allowed = True

class SocialProject(BaseModel):
    id: PyObjectId = Field(alias="_id", default=None)
    name: str
    description: str
    organizer: str
    location_address: str
    website_url: Optional[str] = None
    donation_url: Optional[str] = None
    image_url: Optional[str] = None
    tags: List[str] = Field(default_factory=list)

    class Config:
        json_encoders = {ObjectId: str}
        populate_by_name = True
        arbitrary_types_allowed = True

class SocialProjectCreate(BaseModel):
    name: str
    description: str
    organizer: str
    location_address: str
    website_url: Optional[str] = None
    donation_url: Optional[str] = None
    image_url: Optional[str] = None
    tags: List[str] = Field(default_factory=list)

class SocialLinks(BaseModel):
    instagram: Optional[str] = None
    twitter: Optional[str] = None
    facebook: Optional[str] = None

class PlayerProfile(BaseModel):
    id: PyObjectId = Field(alias="_id", default=None)
    user_id: str
    # Torne os campos que podem estar em branco opcionais
    full_name: Optional[str] = None
    birth_date: Optional[date] = None
    position: Optional[str] = None
    bio: Optional[str] = None
    image_url: Optional[str] = None
    social_links: Optional[SocialLinks] = None
    
    class Config:
        json_encoders = {ObjectId: str}
        populate_by_name = True
        arbitrary_types_allowed = True

class Media(BaseModel):
    id: PyObjectId = Field(alias="_id", default=None)
    profile_id: str
    media_type: str # 'video' ou 'photo'
    url: str
    description: Optional[str] = None
    uploaded_at: datetime = Field(default_factory=datetime.now)
    
    class Config:
        json_encoders = {ObjectId: str}
        populate_by_name = True
        arbitrary_types_allowed = True

class PlayerProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    birth_date: Optional[date] = None
    position: Optional[str] = None
    bio: Optional[str] = None
    image_url: Optional[str] = None
    social_links: Optional[SocialLinks] = None

class ProfileMetricsResponse(BaseModel):
    view_count: int

class Post(BaseModel):
    id: PyObjectId = Field(alias="_id", default=None)
    author_profile_id: str
    content: str
    image_url: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.now)
    likes: List[str] = Field(default_factory=list) # Lista de user_ids
    
    class Config:
        json_encoders = {ObjectId: str}
        populate_by_name = True
        arbitrary_types_allowed = True

class PostCreate(BaseModel):
    content: str
    image_url: Optional[str] = None

# Modelo para o retorno do feed, incluindo dados do autor
class PostInFeed(Post):
    author_name: str
    author_image_url: Optional[str] = None

class CommentCreate(BaseModel):
    """Modelo para os dados recebidos ao criar um comentário."""
    content: str

class Comment(BaseModel):
    """Modelo para representar um comentário completo retornado pela API."""
    id: str = Field(alias="_id")
    post_id: str
    author_id: str
    author_name: str
    content: str
    created_at: datetime = Field(default_factory=datetime.now)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {
            datetime: lambda dt: dt.isoformat()
        }

class TeamCreate(BaseModel):
    name: str


# 2. Modify your models to use this type for the ID
class TournamentResponse(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    name: str
    description: str
    # ... other fields for tournament
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class Team(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    name: str
    # ... other fields for team

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}