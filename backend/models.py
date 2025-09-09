from sqlalchemy import Column, Integer, String, ForeignKey, Text, DateTime
from sqlalchemy import PrimaryKeyConstraint
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class Admin(Base):
    __tablename__ = "admin"
    user_id = Column('User_ID', Integer, primary_key=True, index=True)
    email = Column('Email', String(100), unique=True, nullable=False) 
    name = Column('Name', String(200), nullable=True)
    position = Column('Position', String(200), nullable=True)
    password = Column('password', String(255), nullable=False)

class Researcher(Base):
    __tablename__ = "researcher"
    user_id = Column('User_ID', Integer, primary_key=True, index=True)
    email = Column('Email', String(100), unique=True, nullable=False)
    name = Column('Name', String(200), nullable=True)
    citation_count = Column('Citation_count', Integer, nullable=True)
    publication_count = Column('Publication_count', Integer, nullable=True)
    password = Column('password', String(255), nullable=False)
    projects = relationship("Project", back_populates="owner")


class Reviewer(Base):
    __tablename__ = "reviewer"
    user_id = Column('User_ID', Integer, primary_key=True, index=True)
    email = Column('Email', String(100), unique=True, nullable=False)
    name = Column('Name', String(200), nullable=True)
    education = Column('Education', String(200), nullable=True)
    password = Column('password', String(255), nullable=False)
    

class Project(Base):
    __tablename__ = "project"

    id = Column('Project_ID', Integer, primary_key=True, index=True)
    title = Column('Project_Title', String(250), nullable=False)
    description = Column('Description', Text, nullable=True)
    date_created = Column('Date_created', DateTime, default=datetime.utcnow) 
    created_by = Column('Created_By', Integer, ForeignKey('researcher.User_ID'))
    
    owner = relationship("Researcher", back_populates="projects")



class ProjectMember(Base):
    __tablename__ = "project_member"
    project_id = Column('Project_ID', Integer, ForeignKey("project.Project_ID"), primary_key=True)
    user_id = Column('User_ID', Integer, primary_key=True)
    role_in_project = Column('Role_in_project', String(100), nullable=True)


class Tag(Base):
    __tablename__ = "tag"
    id = Column('Tag_ID', Integer, primary_key=True, index=True)
    tag_name = Column('Tag_Name', String(150), nullable=False, unique=True)


class ProjectTag(Base):
    __tablename__ = "project_tag"
    project_id = Column('Project_ID', Integer, ForeignKey("project.Project_ID"), primary_key=True)
    tag_id = Column('Tag_ID', Integer, ForeignKey("tag.Tag_ID"), primary_key=True)


class Paper(Base):
    __tablename__ = 'paper'
    paper_id = Column('Paper_ID', Integer, primary_key=True)
    title = Column('Title', String(200), nullable=False)
    status = Column('Status', String(50), default='draft')
    date_uploaded = Column('Date_Uploaded', DateTime, default=datetime.utcnow)
    abstract = Column('Abstract', Text) 
    author_id = Column('Author_ID', Integer, ForeignKey('researcher.User_ID'))
    project_id = Column('Project_ID', Integer, ForeignKey('project.Project_ID'))


class PaperReview(Base):
    __tablename__ = "paper_review"
    id = Column('Review_ID', Integer, primary_key=True, index=True)
    paper_id = Column('Paper_ID', Integer, ForeignKey("paper.Paper_ID"))
    reviewer_id = Column('Reviewer_ID', Integer, ForeignKey("reviewer.User_ID"))
    review_date = Column('Review_Date', DateTime, default=datetime.utcnow)
    decision = Column('Decision', String(50), nullable=True)
    

class Feedback(Base):
    __tablename__ = "feedback"
    id = Column('id', Integer, primary_key=True, index=True) 
    review_id = Column('Review_ID', Integer, ForeignKey("paper_review.Review_ID"), nullable=False) 
    feedback = Column('Feedback', Text)


class Dataset(Base):
    __tablename__ = "dataset"
    id = Column('Dataset_ID', Integer, primary_key=True, index=True)
    project_id = Column('Project_ID', Integer, ForeignKey("project.Project_ID"), nullable=True)
    owner_id = Column('Owner_ID', Integer, ForeignKey("researcher.User_ID"))
    title = Column('Title', String(300), nullable=False)
    description = Column('Description', Text, nullable=True)
    date_created = Column('Date_Created', DateTime, default=datetime.utcnow)


class DatasetTag(Base):
    __tablename__ = "dataset_tag"
    dataset_id = Column('Dataset_ID', Integer, ForeignKey("dataset.Dataset_ID"), primary_key=True)
    tag_id = Column('Tag_ID', Integer, ForeignKey("tag.Tag_ID"), primary_key=True)


class DatasetAccess(Base):
    __tablename__ = "dataset_access"
    id = Column('Access_ID', Integer, primary_key=True, index=True)
    dataset_id = Column('Dataset_ID', Integer, ForeignKey("dataset.Dataset_ID"))
    user_id = Column('User_ID', Integer, ForeignKey("researcher.User_ID"))
    granted_by = Column('Granted_By', Integer, ForeignKey("admin.User_ID"))
    granted_at = Column('Granted_At', DateTime, default=datetime.utcnow)


class AccessRequest(Base):
    __tablename__ = "access_request"
    id = Column('Request_ID', Integer, primary_key=True, index=True)
    dataset_id = Column('Dataset_ID', Integer, ForeignKey("dataset.Dataset_ID"))
    requester_id = Column('Requester_ID', Integer, ForeignKey("researcher.User_ID"))
    status = Column('Status', String(50), default="pending") 
    date_requested = Column('Date_Requested', DateTime, default=datetime.utcnow)
    date_decided = Column('Date_Decided', DateTime, nullable=True)
    approved_by = Column('Approved_By', Integer, ForeignKey("researcher.User_ID"), nullable=True)
    admin_approved_by = Column('Admin_Approved_By', Integer, ForeignKey("admin.User_ID"), nullable=True)
