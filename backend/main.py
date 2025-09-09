from fastapi import FastAPI, Depends, HTTPException, Header, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
import models, schemas
from database import engine, SessionLocal
from typing import Union, List
from sqlalchemy import or_
from datetime import datetime

models.Base.metadata.create_all(bind=engine)

app = FastAPI()


from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ------------------------
# AUTH / LOGIN
# ------------------------
@app.post("/login/", response_model=schemas.LoginResp)
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    # Check Admin
    user_db = db.query(models.Admin).filter(models.Admin.user_id == user.user_id).first()
    if user_db:
        if user_db.password == user.password:
            return {"role": "admin", "user_id": user_db.user_id, "name": user_db.name}
        else:
            raise HTTPException(status_code=401, detail="Invalid credentials")

    user_db = db.query(models.Researcher).filter(models.Researcher.user_id == user.user_id).first()
    if user_db:
        if user_db.password == user.password:
            return {"role": "researcher", "user_id": user_db.user_id, "name": user_db.name}
        else:
            raise HTTPException(status_code=401, detail="Invalid credentials")

    user_db = db.query(models.Reviewer).filter(models.Reviewer.user_id == user.user_id).first()
    if user_db:
        if user_db.password == user.password:
            return {"role": "reviewer", "user_id": user_db.user_id, "name": user_db.name}
        else:
            raise HTTPException(status_code=401, detail="Invalid credentials")

    raise HTTPException(status_code=401, detail="Invalid credentials")

def get_user_role(user_id: int, db: Session):
    """Determine user role from user_id"""
    # Check Admin
    user = db.query(models.Admin).filter(models.Admin.user_id == user_id).first()
    if user:
        return "admin"
    
    # Check Researcher
    user = db.query(models.Researcher).filter(models.Researcher.user_id == user_id).first()
    if user:
        return "researcher"
    
    # Check Reviewer
    user = db.query(models.Reviewer).filter(models.Reviewer.user_id == user_id).first()
    if user:
        return "reviewer"
    
    return None  # User not found


@app.post("/register/")
def register(user: schemas.UserRegister, db: Session = Depends(get_db)):
    if user.role == "researcher":
        new_user = models.Researcher(
        email=user.email,
        name=user.name,
        password=user.password,
        citation_count=user.citation_count if user.citation_count is not None else 0,
        publication_count=user.publication_count if user.publication_count is not None else 0
    )
    elif user.role == "reviewer":
        # Check if education field is provided for reviewers
        if not user.education:
            raise HTTPException(status_code=400, detail="Education field is required for reviewers")
        new_user = models.Reviewer(
            email=user.email,
            name=user.name,
            password=user.password,
            education=user.education
        )
    else:
        raise HTTPException(status_code=400, detail="Invalid role specified. Must be 'researcher' or 'reviewer'")

    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return {"message": "Registration successful", "user_id": new_user.user_id, "role": user.role}
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Email already registered")


# ------------------------
# ROLE HELPERS
# ------------------------
def get_caller(x_user_role: str = Header(...), x_user_id: int = Header(...)):
    return {"role": x_user_role, "user_id": x_user_id}


# ------------------------
# PROJECTS
# ------------------------
def get_current_user(user_id: int = Header(..., alias="X-User-Id"), db: Session = Depends(get_db)):
    """Return the full user object (Researcher/Admin/Reviewer) based on ID"""
    # Check Researcher
    user = db.query(models.Researcher).filter(models.Researcher.user_id == user_id).first()
    if user:
        return user
    # Check Admin
    user = db.query(models.Admin).filter(models.Admin.user_id == user_id).first()
    if user:
        return user
    # Check Reviewer
    user = db.query(models.Reviewer).filter(models.Reviewer.user_id == user_id).first()
    if user:
        return user
    raise HTTPException(status_code=404, detail="User not found")


@app.post("/projects/", response_model=schemas.ProjectOut)
def create_project(
    project: schemas.ProjectCreate,
    db: Session = Depends(get_db),
    current_user: Union[models.Researcher, models.Admin, models.Reviewer] = Depends(get_current_user)
):
    # Only researchers or admins can create projects
    if not isinstance(current_user, (models.Researcher, models.Admin)):
        raise HTTPException(status_code=403, detail="Only researchers or admins can create projects")

    db_project = models.Project(
        title=project.title,
        description=project.description,
        created_by=current_user.user_id,  # assign current user
        date_created=datetime.utcnow()
    )
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project



@app.get("/projects/", response_model=List[schemas.ProjectOut])
def list_projects(
    user_id: int = Header(..., alias="X-User-Id"),
    user_role: str = Header(None, alias="X-User-Role"),  # optional header
    db: Session = Depends(get_db)
):
    try:
        # Default role assignment if not provided
        if user_role is None:
            ADMIN_USER_IDS = [3]  
            user_role = "admin" if user_id in ADMIN_USER_IDS else "researcher"
        
        # Validate role
        if user_role not in ["admin", "researcher", "reviewer"]:
            raise HTTPException(status_code=400, detail="Invalid user role")
        
        # Admin: can see all projects
        if user_role == "admin":
            projects = db.query(models.Project).all()
        else:
            # Researchers/Reviewers: can see only their own
            projects = db.query(models.Project).filter(
    models.Project.created_by == user_id
).all()
        
        return projects

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")



@app.post("/projects/{project_id}/members/", response_model=schemas.ProjectMemberOut)
def add_project_member(project_id: int, pm: schemas.ProjectMemberBase, db: Session = Depends(get_db), caller=Depends(get_caller)):
    proj = db.get(models.Project, project_id)
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")

    existing = db.query(models.ProjectMember).filter(
        models.ProjectMember.project_id == project_id,
        models.ProjectMember.user_id == pm.user_id
    ).first()
    if existing:
        raise HTTPException(status_code=409, detail="Researcher already in project")

    pm_db = models.ProjectMember(**pm.dict(), project_id=project_id)
    db.add(pm_db)
    db.commit()
    db.refresh(pm_db)
    return pm_db


@app.post("/projects/{project_id}/tags/", response_model=schemas.ProjectTagOut)
def add_project_tag(project_id: int, pt: schemas.ProjectTagBase, db: Session = Depends(get_db), caller=Depends(get_caller)):
    proj = db.get(models.Project, project_id)
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")
    try:
        tag = db.query(models.Tag).filter(models.Tag.tag_name == pt.tag_name).first()
        if not tag:
            tag = models.Tag(tag_name=pt.tag_name)
            db.add(tag)
            db.commit()
            db.refresh(tag)
        pt_db = models.ProjectTag(project_id=project_id, tag_id=tag.id)
        db.add(pt_db)
        db.commit()
        db.refresh(pt_db)
        return pt_db
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Tag already exists for project")


# ------------------------
# PAPERS
# ------------------------
@app.post("/papers/", response_model=schemas.PaperOut)
def create_paper(
    paper_data: schemas.PaperCreate,
    db: Session = Depends(get_db),
    caller=Depends(get_caller)
):
    if caller["role"] != "researcher":
        raise HTTPException(status_code=403, detail="Only researchers can submit papers")

    # Verify researcher exists
    researcher = db.query(models.Researcher).filter(
        models.Researcher.user_id == caller["user_id"]
    ).first()
    
    if not researcher:
        raise HTTPException(status_code=404, detail="Researcher not found")

    # Validate project - USE THE CORRECT ATTRIBUTE NAME (.id not .project_id)
    project = db.query(models.Project).filter(
        models.Project.id == paper_data.project_id  # ← THIS IS THE FIX
    ).first()
    
    if not project:
        raise HTTPException(
            status_code=404, 
            detail=f"Project with ID {paper_data.project_id} not found"
        )

    # Create the paper
    paper = models.Paper(
        title=paper_data.title,
        abstract=paper_data.abstract,
        status=paper_data.status,
        author_id=caller["user_id"],
        project_id=paper_data.project_id
    )

    try:
        db.add(paper)
        db.commit()
        db.refresh(paper)
        return paper
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500, 
            detail=f"Failed to create paper: {str(e)}"
        )


def get_current_researcher(user_id: int = Header(..., alias="X-User-Id"), db: Session = Depends(get_db)):
    user = db.query(models.Researcher).filter(models.Researcher.user_id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Researcher not found or invalid credentials"
        )
    return user

# Papers
@app.put("/papers/{paper_id}/", response_model=schemas.PaperOut)
def update_paper(paper_id: int, p: schemas.PaperCreate, db: Session = Depends(get_db), caller=Depends(get_caller)):
    paper = db.get(models.Paper, paper_id)
    if not paper:
        raise HTTPException(status_code=404, detail="Paper not found")
    paper.title = p.title
    paper.abstract = p.abstract
    paper.status = p.status
    db.add(paper)
    db.commit()
    db.refresh(paper)
    return paper

@app.delete("/papers/{paper_id}/")
def delete_paper(paper_id: int, db: Session = Depends(get_db), caller=Depends(get_caller)):
    paper = db.get(models.Paper, paper_id)
    if not paper:
        raise HTTPException(status_code=404, detail="Paper not found")
    db.delete(paper)
    db.commit()
    return {"message": "deleted"}


#projects

@app.put("/projects/{project_id}/", response_model=schemas.ProjectOut)
def update_project(project_id: int, project: schemas.ProjectCreate, db: Session = Depends(get_db), caller=Depends(get_caller)):
    proj = db.get(models.Project, project_id)
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")
    # optional: check permissions (caller role/owner)
    proj.title = project.title
    proj.description = project.description
    db.add(proj)
    db.commit()
    db.refresh(proj)
    return proj

@app.delete("/projects/{project_id}/")
def delete_project(project_id: int, db: Session = Depends(get_db), caller=Depends(get_caller)):
    proj = db.get(models.Project, project_id)
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(proj)
    db.commit()
    return {"message": "deleted"}


# REVIEWS
# ------------------------
@app.post("/papers/{paper_id}/reviews/", response_model=schemas.PaperReviewOut)
def create_review(paper_id: int, r: schemas.PaperReviewCreate, db: Session = Depends(get_db), caller=Depends(get_caller)):
    if caller["role"] != "reviewer":
        raise HTTPException(status_code=403, detail="Only reviewers can add reviews")

    paper = db.get(models.Paper, paper_id)
    if not paper:
        raise HTTPException(status_code=404, detail="Paper not found")

    review = models.PaperReview(**r.dict(), paper_id=paper_id, reviewer_id=caller["user_id"])
    db.add(review)
    paper.status = "under_review"
    db.commit()
    db.refresh(review)
    return review

@app.get("/papers/", response_model=list[schemas.PaperOut])
def list_papers(
    user_id: int = Header(..., alias="X-User-Id"),
    db: Session = Depends(get_db)
):
    user_role = get_user_role(user_id, db)
    
    if user_role == "admin":
        return db.query(models.Paper).all()
    elif user_role == "researcher":
        return db.query(models.Paper).filter(models.Paper.author_id == user_id).all()
    else:
        raise HTTPException(status_code=403, detail="Access denied")

# ------------------------
# DATASETS
# ------------------------
# main.py
@app.post("/datasets/", response_model=schemas.DatasetOut)
def create_dataset(d: schemas.DatasetCreate, db: Session = Depends(get_db), caller=Depends(get_caller)):
    if caller["role"] != "researcher":
        raise HTTPException(status_code=403, detail="Only researchers can upload datasets")
    
    dataset_dict = d.dict()
    # If project_id is empty string or None, set to None
    if not dataset_dict.get("project_id"):
        dataset_dict["project_id"] = None
    
    dataset = models.Dataset(**dataset_dict, owner_id=caller["user_id"])
    db.add(dataset)
    db.commit()
    db.refresh(dataset)
    return dataset




@app.get("/datasets/", response_model=Union[List[schemas.DatasetOut], dict])
def list_datasets(
    user_id: int = Header(..., alias="X-User-Id"),
    db: Session = Depends(get_db)
):
    user_role = get_user_role(user_id, db)
    
    if not user_role:
        raise HTTPException(status_code=401, detail="User not found")
    
    if user_role not in ["researcher", "admin"]:
        raise HTTPException(status_code=403, detail="Access denied")
    
    if user_role == "admin":
        datasets = db.query(models.Dataset).all()
    else:
        datasets = db.query(models.Dataset).filter(
            models.Dataset.owner_id == user_id
        ).all()
    
    if not datasets:
        return {"message": "No datasets found for you"}
    
    return datasets



@app.post("/datasets/{dataset_id}/tags/", response_model=schemas.DatasetTagOut)
def add_dataset_tag(dataset_id: int, dtag: schemas.DatasetTagBase, db: Session = Depends(get_db), caller=Depends(get_caller)):
    dataset = db.get(models.Dataset, dataset_id)
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")

    try:
        tag = db.query(models.Tag).filter(models.Tag.tag_name == dtag.tag_name).first()
        if not tag:
            tag = models.Tag(tag_name=dtag.tag_name)
            db.add(tag)
            db.commit()
            db.refresh(tag)
        dtag_db = models.DatasetTag(dataset_id=dataset_id, tag_id=tag.id)
        db.add(dtag_db)
        db.commit()
        db.refresh(dtag_db)
        return dtag_db
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Tag already exists for dataset")

# Datasets
@app.put("/datasets/{dataset_id}/", response_model=schemas.DatasetOut)
def update_dataset(dataset_id: int, d: schemas.DatasetCreate, db: Session = Depends(get_db), caller=Depends(get_caller)):
    dataset = db.get(models.Dataset, dataset_id)
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
    dataset.title = d.title
    dataset.description = d.description
    db.add(dataset)
    db.commit()
    db.refresh(dataset)
    return dataset

@app.delete("/datasets/{dataset_id}/")
def delete_dataset(dataset_id: int, db: Session = Depends(get_db), caller=Depends(get_caller)):
    dataset = db.get(models.Dataset, dataset_id)
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
    db.delete(dataset)
    db.commit()
    return {"message": "deleted"}


# FEEDBACK
# ------------------------
@app.post("/feedback/", response_model=schemas.FeedbackOut)
def add_feedback(
    f: schemas.FeedbackCreate, 
    db: Session = Depends(get_db), 
    caller=Depends(get_caller)
):
    review = db.get(models.PaperReview, f.review_id)
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    
    fb = models.Feedback(**f.dict())
    db.add(fb)
    db.commit()
    db.refresh(fb)
    return fb


@app.get("/feedbacks/", response_model=list[schemas.FeedbackOut])
def list_feedbacks(db: Session = Depends(get_db)):
    feedbacks = db.query(models.Feedback).all()
    return feedbacks



# ------------------------
# ACCESS REQUESTS
# ------------------------
@app.post("/datasets/{dataset_id}/access-requests/", response_model=schemas.AccessRequestOut)
def create_access_request(dataset_id: int, db: Session = Depends(get_db), caller=Depends(get_caller)):
    if caller["role"] != "researcher":
        raise HTTPException(status_code=403, detail="Only researchers can request dataset access")

    dataset = db.get(models.Dataset, dataset_id)
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")

    # prevent duplicate pending requests
    existing = db.query(models.AccessRequest).filter(
        models.AccessRequest.dataset_id == dataset_id,
        models.AccessRequest.requester_id == caller["user_id"],
        models.AccessRequest.status == "pending"
    ).first()
    if existing:
        raise HTTPException(status_code=409, detail="Request already pending")

    req = models.AccessRequest(dataset_id=dataset_id, requester_id=caller["user_id"], status="pending")
    db.add(req)
    db.commit()
    db.refresh(req)
    return req


@app.post("/access-requests/{req_id}/approve/", response_model=schemas.AccessRequestOut)
def approve_access_request(req_id: int, db: Session = Depends(get_db), caller=Depends(get_caller)):
    req = db.get(models.AccessRequest, req_id)
    if not req:
        raise HTTPException(status_code=404, detail="Access request not found")

    if caller["role"] != "researcher" or caller["user_id"] != req.dataset.owner_id:
        raise HTTPException(status_code=403, detail="Only dataset owner can approve")

    req.status = "approved"
    db.add(models.DatasetAccess(dataset_id=req.dataset_id, user_id=req.requester_id))
    db.commit()
    db.refresh(req)
    return req


@app.post("/access-requests/{req_id}/deny/", response_model=schemas.AccessRequestOut)
def deny_access_request(req_id: int, db: Session = Depends(get_db), caller=Depends(get_caller)):
    req = db.get(models.AccessRequest, req_id)
    if not req:
        raise HTTPException(status_code=404, detail="Access request not found")

    if caller["role"] != "researcher" or caller["user_id"] != req.dataset.owner_id:
        raise HTTPException(status_code=403, detail="Only dataset owner can deny")

    req.status = "denied"
    db.commit()
    db.refresh(req)
    return req


# ------------------------
# ADMIN ENDPOINTS
# ------------------------
@app.get("/admin/all-researchers/", response_model=list[schemas.ResearcherPublic])
def all_researchers(db: Session = Depends(get_db), caller=Depends(get_caller)):
    if caller["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admins only")
    return db.query(models.Researcher).all()


@app.get("/admin/all-reviewers/")
def all_reviewers(db: Session = Depends(get_db), caller=Depends(get_caller)):
    if caller["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admins only")
    return db.query(models.Reviewer).all()





# PUBLICATION / CITATION COUNTS
# ------------------------
@app.get("/researcher/publication-citation-counts/")
def pub_cit_counts(db: Session = Depends(get_db)):
    query_result = db.query(
        models.Researcher.name,
        models.Researcher.publication_count,
        models.Researcher.citation_count
    ).all()

    return [
        {
            "name": row[0],
            "publication_count": row[1],
            "citation_count": row[2]
        }
        for row in query_result
    ]


def get_authenticated_user(user_id: int = Header(..., alias="X-User-Id"), db: Session = Depends(get_db)):
    user_role = get_user_role(user_id, db)
    if not user_role:
        raise HTTPException(status_code=401, detail="Invalid user credentials")
    
    return {"user_id": user_id, "role": user_role}

# Use it in your endpoints
@app.get("/admin/dashboard/")
def admin_dashboard(current_user: dict = Depends(get_authenticated_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    # Admin-only functionality
    return {"message": "Welcome to admin dashboard"}