from flask_sqlalchemy import SQLAlchemy
import os
from dotenv import load_dotenv

db = SQLAlchemy()

def init_db(app):
    load_dotenv()

    db_user = os.getenv('DB_USER', '').strip()
    db_password = os.getenv('DB_PASSWORD', '').strip()
    db_host = os.getenv('DB_HOST', '').strip()
    db_port = os.getenv('DB_PORT', '3306').strip()  
    db_name = os.getenv('DB_NAME', '').strip()

    app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+pymysql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  

    db.init_app(app)
