# config.py
import os

# For bot (not used by Flask API)
BOT_TOKEN = os.getenv('BOT_TOKEN', 'your-token-here')

# For database (used by both)
DATABASE_NAME = os.getenv('DATABASE_NAME', 'telegram_cloud.db')
