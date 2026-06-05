from sqlalchemy import create_engine
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL="sqlite:///dados/camara.db"

#DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)