from fastapi import FastAPI, WebSocket, WebSocketDisconnect
import logging
import json
import asyncio
from fastapi.middleware.cors import CORSMiddleware
from routes.download_routes import router as download_router
from utils.websocket_manager import websocket_manager

logging.basicConfig(level=logging.DEBUG)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permitir todas as origens
    allow_credentials=True,
    allow_methods=["*"],  # Permitir todos os métodos HTTP
    allow_headers=["*"],  # Permitir todos os cabeçalhos
)

@app.get("/")
def root():
    return "Ativo"

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket_manager.connect(websocket)
    try:
        while True:
            # Manter conexão viva e escutar mensagens do cliente
            data = await websocket.receive_text()
            message = json.loads(data)
            
            if message.get("type") == "ping":
                await websocket_manager.send_message({"type": "pong"}, websocket)
            elif message.get("type") == "cleanup_request":
                # Cliente solicitou limpeza de um arquivo específico
                file_path = message.get("file_path")
                if file_path:
                    await websocket_manager.schedule_file_cleanup(file_path, delay=5)
                    await websocket_manager.send_message({
                        "type": "cleanup_scheduled",
                        "file_path": file_path
                    }, websocket)
                    
    except WebSocketDisconnect:
        websocket_manager.disconnect(websocket)
    except Exception as e:
        logging.error(f"Erro no WebSocket: {e}")
        websocket_manager.disconnect(websocket)

# Incluir as rotas de download
app.include_router(download_router)
