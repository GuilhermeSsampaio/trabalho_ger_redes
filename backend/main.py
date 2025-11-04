from fastapi import FastAPI
import logging
from fastapi.middleware.cors import CORSMiddleware
from routes.download_routes import router as download_router

logging.basicConfig(level=logging.DEBUG)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permitir todas as origens
    allow_credentials=True,
    allow_methods=["*"],  # Permitir todos os métodos HTTP
    allow_headers=["*"],  # Permitir todos os cabeçalhos
)

# Incluir as rotas de download
app.include_router(download_router)
