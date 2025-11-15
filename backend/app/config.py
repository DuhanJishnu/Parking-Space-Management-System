import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Base configuration"""
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # JWT Configuration
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'jwt-secret-key'
    JWT_ACCESS_TOKEN_EXPIRES = 3600  # 1 hour
    
    # Connection pool settings for Neon
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_recycle': 300,
        'pool_pre_ping': True,
        'pool_size': int(os.environ.get('DATABASE_POOL_SIZE', 5)),
        'max_overflow': int(os.environ.get('DATABASE_MAX_OVERFLOW', 10)),
        'pool_timeout': 30,
    }

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    # Neon PostgreSQL connection string
    SQLALCHEMY_DATABASE_URI = os.environ.get('NEON_DATABASE_URL')

class TestingConfig(Config):
    """Testing configuration"""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = os.environ.get('TEST_NEON_DATABASE_URL')

class ProductionConfig(Config):
    """Production configuration"""
    SQLALCHEMY_DATABASE_URI = os.environ.get('NEON_DATABASE_URL')

config = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}