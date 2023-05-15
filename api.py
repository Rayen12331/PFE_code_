from fastapi import FastAPI, Query, Depends, HTTPException, status, Header
from pydantic import BaseModel
from git import Repo
from subprocess import Popen, PIPE
import subprocess
from fastapi import Form
import os
import yaml
from prometheus_fastapi_instrumentator import Instrumentator
import logging
from fluent import handler as fluent_handler
from fluent import sender
from fluent import event
from logging.handlers import RotatingFileHandler
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import JWTError, jwt
from pydantic import BaseModel
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from fastapi.middleware.cors import CORSMiddleware
import httpx
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker




logging.basicConfig(
    level=logging.DEBUG,
    format="{asctime} {levelname:<8} {message}",
    style='{',
    filename='mylog.log',
    filemode='w'
)

SECRET_KEY = "5a7917c4ee6b89f3716ab13f81f03bc50f270de8755f70435853827a1cd931df"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

db = {
    "tim": {
        "username": "tim",
        "full_name": "tim Ruscica",
        "email": "tim@gmail.com",
        "hashed_password": "$2b$12$dtS1uoda7I9MGzvxIEqMtuszbY5olWZW08G2I76AEqc3rBcGt32wm",
        "disabled": False

    }
}

class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str or None = None  


class User(BaseModel):
    username: str
    email: str or None = None
    full_name: str or None = None
    disabled: bool or None = None

class UserInDB(User):
    hashed_password: str

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")



app = FastAPI()
Instrumentator().instrument(app).expose(app)

origins = [
    "http://localhost",
    "http://localhost:3001", # replace with your frontend URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Project(Base):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(String)

# Create the database tables
Base.metadata.create_all(bind=engine)

# Define the request body schema
class ProjectRequest(BaseModel):
    name: str
    description: str

# Define the response schema
class ProjectResponse(BaseModel):
    id: int
    name: str
    description: str

@app.post("/project/")
async def create_project(project: ProjectRequest, token: str = Header(...)):
    db = SessionLocal()
    try:
        # Create the new project in the database
        db_project = Project(name=project.name, description=project.description)
        db.add(db_project)
        db.commit()
        db.refresh(db_project)

        # Return the newly created project
        return ProjectResponse(id=db_project.id, name=db_project.name, description=db_project.description)
    finally:
        db.close()


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str):
    return pwd_context.hash(password)


def get_user(db, username: str):
    if username in db:
        user_data = db[username]
        return UserInDB(**user_data)
    

def authenticate_user(db, username: str, password: str):
    user = get_user(db, username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

def create_access_token(data: dict, expires_delta: timedelta or None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    user = get_user(db, username=token_data.username)
    if user is None:
        raise credentials_exception
    return user


async def get_current_active_user(current_user: User = Depends(get_current_user)):
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user




@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
    data={"sub": user.username}, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/users/me", response_model=User)
async def read_users_me(
    current_user: User = Depends(get_current_active_user)
):
    return current_user

@app.get("/api//users/me/items/", response_model=User)
async def read_own_items(
    current_user: User = Depends(get_current_active_user)
):
    return {
        "item_id": 1,
        "owner": current_user
    }


class CloneRequest(BaseModel):
    owner: str
    repo: str
    access_token: str

@app.post("/clone_repository")
async def clone_repository(request: CloneRequest):
    logging.info('clone done ')
    repo_url = f"https://{request.access_token}@github.com/{request.owner}/{request.repo}.git"
    local_dir = f"./{request.repo}"
    
    try:
        # Clone the repository
        Repo.clone_from(repo_url, local_dir, depth=1)
        return {"message": "Repo Cloned successfully!"}

    
    except Exception as e:
        return {"error": str(e)}

@app.get("/build")
async def build_microservice(microservice_path: str = Query(...), command: str = Query(...)):
    logging.info('build done ')

    process = Popen(command, shell=True, cwd=microservice_path, stdout=PIPE, stderr=PIPE)
    stdout, stderr = process.communicate()
    output = stdout.decode("utf-8") + stderr.decode("utf-8")
    return {"output": "build done successfully"}   
    


@app.post("/rundockercompose")
async def run_docker_compose(directory_path: str = Query(...)):
    cmd = ["docker-compose", "up", "-d"]
    proc = subprocess.run(cmd, cwd=directory_path, capture_output=True)
    if proc.returncode != 0:
        raise Exception(f"Failed to run docker-compose: {proc.stderr}")
    return {"message": "Docker compose started successfully!"}

@app.post("/rundockercomposeSpring")
async def run_docker_compose():
    logging.info('spring docker running' )
    logging.info('Response from docker compose up Spring API: message: Docker Compose is now running.')
  

    process = Popen(['docker-compose', 'up', '-d'], cwd='Springboot3/')
    return {"message": "Docker Compose is now running."}



@app.post("/change_port/{service_name}/{new_port}")
async def change_port(service_name: str , new_port: int , compose_path: str  = Query(...) ):
    
    logging.info('port changed' )
    logging.info('Response from change_port API: message: Port changed.')

    
    # Update the Docker Compose file with the new port
    with open(compose_path, 'r') as f:
        compose_file = f.read()
    old_port = compose_file.split(f"{service_name}:")[1].split("ports:")[1].split("- ")[1].split(":")[0]
    compose_file = compose_file.replace(f"{old_port}:{old_port}\n", f"{new_port}:{new_port}\n")
    with open(compose_path, 'w') as f:
        f.write(compose_file)

    # Restart the Docker Compose service with docker-compose up
    os.system(f"cd {os.path.dirname(compose_path)} && docker-compose up -d --force-recreate {service_name}")

    return {"message": f"Port for service {service_name} changed from {old_port} to {new_port}"}


@app.post("/add_tag/{service_name}/{tag}")
async def add_tag(service_name: str, tag: str, compose_path:str = Query(...)):
    logging.info('tag added' )
    logging.info('Response from Add tag API: message: Tag added.')


    try:
        with open(compose_path, 'r') as file:
            compose_config = yaml.safe_load(file)

        if service_name in compose_config['services']:
            compose_config['services'][service_name]['image'] = f"{compose_config['services'][service_name]['image']}:{tag}"
            
            with open(compose_path, 'w') as file:
                yaml.dump(compose_config, file)
                
            subprocess.run(['docker-compose', '-f', compose_path, 'up', '-d'], check=True)
            
            return {"message": f"Tag {tag} added to service {service_name} successfully in {compose_path}!"}
        else:
            return {"message": f"Service {service_name} not found in {compose_path}."}
    except Exception as e:
        return {"message": f"Error adding tag to service {service_name} in {compose_path}: {str(e)}"}


@app.post("/add_volume_to_compose/{volume_path}")
async def add_volume_to_compose(volume_path: str , compose_path:str = Query(...)):
    logging.info('volume added' )
    logging.info('Response from Adding volume API: message:  Volume added.')



    # Open the Docker Compose file
    with open(compose_path, "r") as compose_file:
        compose_data = yaml.safe_load(compose_file)

    # Add the volume path to the Docker Compose file
    for service in compose_data["services"].values():
        if "volumes" in service:
            service["volumes"].append(f"{volume_path}:{volume_path}")
        else:
            service["volumes"] = [f"{volume_path}:{volume_path}"]

    # Write the updated Docker Compose file
    with open(compose_path, "w") as compose_file:
        yaml.dump(compose_data, compose_file, default_flow_style=False)

    return {"message": f"Volume path {volume_path} added to Docker Compose file!"}

@app.post("/add_env_to_compose/{env_name}/{env_value}")
async def add_env_to_compose(env_name: str, env_value: str , compose_path:str = Query(...) ):
    logging.info('env added to compose' )
    logging.info('Response from adding environment to compose API: message: Env added to compose')


    # Set the path to the Docker Compose file

    # Open the Docker Compose file
    with open(compose_path, "r") as compose_file:
        compose_data = yaml.safe_load(compose_file)

    # Add the environment variable to the Docker Compose file
    for service in compose_data["services"].values():
        if "environment" in service:
            service["environment"][env_name] = env_value
        else:
            service["environment"] = {env_name: env_value}

    # Write the updated Docker Compose file
    with open(compose_path, "w") as compose_file:
        yaml.dump(compose_data, compose_file)

    return {"message": f"Environment variable {env_name}={env_value} added to Docker Compose file!"}