import asyncio
import json
import logging
import os
from typing import Set
from fastapi import WebSocket, WebSocketDisconnect

logger = logging.getLogger(__name__)

class WebSocketManager:
    def __init__(self):
        self.active_connections: Set[WebSocket] = set()
        self.cleanup_tasks = {}  # Mudança de timers para tasks async

    async def connect(self, websocket: WebSocket):
        """Aceita uma nova conexão WebSocket."""
        await websocket.accept()
        self.active_connections.add(websocket)
        logger.info(f"Nova conexão WebSocket estabelecida. Total: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        """Remove uma conexão WebSocket."""
        self.active_connections.discard(websocket)
        logger.info(f"Conexão WebSocket removida. Total: {len(self.active_connections)}")

    async def send_message(self, message: dict, websocket: WebSocket = None):
        """Envia mensagem para uma conexão específica ou todas."""
        message_str = json.dumps(message)
        
        if websocket:
            # Enviar para conexão específica
            try:
                await websocket.send_text(message_str)
            except Exception as e:
                logger.error(f"Erro ao enviar mensagem para WebSocket específico: {e}")
                self.disconnect(websocket)
        else:
            # Enviar para todas as conexões
            disconnected = set()
            for connection in self.active_connections:
                try:
                    await connection.send_text(message_str)
                except Exception as e:
                    logger.error(f"Erro ao enviar mensagem WebSocket: {e}")
                    disconnected.add(connection)
            
            # Remover conexões que falharam
            for conn in disconnected:
                self.disconnect(conn)

    async def notify_download_complete(self, file_path: str, download_type: str, is_zip: bool = False):
        """Notifica que um download foi concluído e agenda remoção."""
        message = {
            "type": "download_complete",
            "file_path": file_path,
            "download_type": download_type,
            "is_zip": is_zip,
            "timestamp": asyncio.get_event_loop().time()
        }
        
        await self.send_message(message)
        
        # Agendar remoção automática do arquivo após 30 segundos
        await self.schedule_file_cleanup(file_path, delay=30)

    async def schedule_file_cleanup(self, file_path: str, delay: int = 30):
        """Agenda a remoção de um arquivo após um tempo determinado."""
        
        async def cleanup_task():
            try:
                # Aguardar o delay
                await asyncio.sleep(delay)
                
                if os.path.exists(file_path):
                    os.remove(file_path)
                    logger.info(f"Arquivo removido automaticamente: {file_path}")
                    
                    # Notificar via WebSocket que o arquivo foi removido
                    await self.send_message({
                        "type": "file_cleaned",
                        "file_path": file_path,
                        "timestamp": asyncio.get_event_loop().time()
                    })
                
                # Remover task da lista
                if file_path in self.cleanup_tasks:
                    del self.cleanup_tasks[file_path]
                    
            except Exception as e:
                logger.error(f"Erro ao remover arquivo {file_path}: {e}")

        # Cancelar task existente se houver
        if file_path in self.cleanup_tasks:
            self.cleanup_tasks[file_path].cancel()

        # Criar nova task
        task = asyncio.create_task(cleanup_task())
        self.cleanup_tasks[file_path] = task
        
        logger.info(f"Agendada remoção do arquivo {file_path} em {delay} segundos")

    async def notify_progress(self, message: str, progress: int = None):
        """Notifica progresso do download."""
        notification = {
            "type": "download_progress",
            "message": message,
            "timestamp": asyncio.get_event_loop().time()
        }
        
        if progress is not None:
            notification["progress"] = progress
            
        await self.send_message(notification)

    def cleanup_all_tasks(self):
        """Cancela todas as tasks de limpeza."""
        for task in self.cleanup_tasks.values():
            if not task.done():
                task.cancel()
        self.cleanup_tasks.clear()

# Instância global do gerenciador
websocket_manager = WebSocketManager()