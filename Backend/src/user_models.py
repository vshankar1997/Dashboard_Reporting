from pydantic import BaseModel

class UserInput(BaseModel):
    username: str
    email: str

class UserDetails(BaseModel):
    id: int
    username: str
    email: str