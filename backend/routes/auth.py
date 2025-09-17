# routes/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from models import UserCreate, UserResponse, UserInDB
from database import users_collection
from security import get_password_hash, verify_password, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from datetime import timedelta

router = APIRouter()

@router.post("/register", status_code=status.HTTP_201_CREATED, response_model=UserResponse)
def create_user(user_data: UserCreate):
    if users_collection.find_one({"email": user_data.email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user_data.senha)
    user_dict = user_data.model_dump()
    user_dict["hashed_password"] = hashed_password
    del user_dict["senha"] # Remove a senha em texto plano
    
    result = users_collection.insert_one(user_dict)
    new_user = users_collection.find_one({"_id": result.inserted_id})
    # Convert ObjectId to str for Pydantic v2 input, then return validated model
    if new_user and "_id" in new_user:
        new_user["_id"] = str(new_user["_id"])
    return UserResponse.model_validate(new_user)

@router.post("/login")
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = users_collection.find_one({"email": form_data.username})
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["email"], "role": user["role"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer", "role": user["role"]}