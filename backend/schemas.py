from pydantic import BaseModel, ConfigDict, Field
from typing import Optional, List
from datetime import datetime


class UserLogin(BaseModel):
    user_id: int
    password: str

class LoginResp(BaseModel):
    role: str
    user_id: int
    name: str

class RegistrationResponse(BaseModel):
    message: str
    user_id: int
    role: str

class UserRegister(BaseModel):
    email: str
    name: str
    password: str
    role: str
    education: Optional[str] = None
    citation_count: Optional[int] = 0  
    publication_count: Optional[int] = 0  

class PaperBase(BaseModel):
    title: str
    abstract: str
    status: str
    project_id: Optional[int] = None
    
class PaperCreate(BaseModel):
    title: str
    abstract: str
    status: str
    project_id: Optional[int] = None  

    
from pydantic import Field

class PaperOut(BaseModel):
    id: int = Field(alias="paper_id")  
    title: str
    abstract: str
    date_uploaded: datetime
    author_id: int
    project_id: Optional[int] = None
    status: str

    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True  
    )

class PaperReviewCreate(BaseModel):
    decision: str  

class PaperReviewOut(PaperReviewCreate):
    id: int
    paper_id: int
    reviewer_id: int
    review_date: datetime  

    model_config = ConfigDict(from_attributes=True)

class ProjectBase(BaseModel):
    title: str
    description: str

class ProjectCreate(ProjectBase):
    pass

class ProjectOut(BaseModel):
    id: int
    title: str
    description: str
    date_created: datetime
    created_by: int
    
    class Config:
        orm_mode = True

class ProjectMemberBase(BaseModel):
    user_id: int

class ProjectMemberOut(ProjectMemberBase):
    id: int
    project_id: int
    role_in_project: Optional[str] = None  

    model_config = ConfigDict(from_attributes=True)

class ProjectTagBase(BaseModel):
    tag_name: str

class ProjectTagOut(ProjectTagBase):
    id: int
    project_id: int
    tag_id: int

    model_config = ConfigDict(from_attributes=True)

class DatasetCreate(BaseModel):
    title: str
    description: str
    project_id: int 

    class Config:
        orm_mode = True
    

class DatasetOut(DatasetCreate):
    id: int
    owner_id: int
    date_created: datetime  

    model_config = ConfigDict(from_attributes=True)

class DatasetTagBase(BaseModel):
    tag_name: str

class DatasetTagOut(DatasetTagBase):
    id: int
    dataset_id: int
    tag_id: int
    
    model_config = ConfigDict(from_attributes=True)


class FeedbackCreate(BaseModel):
    review_id: int
    feedback: str
    
class FeedbackOut(FeedbackCreate):
    id: int  
    # review_id can now repeat

    model_config = ConfigDict(from_attributes=True)

class AccessRequestOut(BaseModel):
    id: int
    requester_id: int
    dataset_id: int
    status: str
    date_requested: datetime
    date_decided: Optional[datetime] = None
    approved_by: Optional[int] = None  
    admin_approved_by: Optional[int] = None
    
    model_config = ConfigDict(from_attributes=True)

class ResearcherPublic(BaseModel):
    user_id: int
    name: str
    email: str
    publication_count: int
    citation_count: int

    model_config = ConfigDict(from_attributes=True)
