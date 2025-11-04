from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
import os
import logging
from utils.utils import (
    DownloadRequest,
    ensure_output_dir,
    download_single_item,
    create_zip_from_files
)

logging.basicConfig(level=logging.DEBUG)

router = APIRouter()

# Rota unificada para downloads
@router.post("/download/")
async def download_content(request: DownloadRequest):
    """
    Rota unificada para baixar conteúdo do YouTube.
    
    - Suporta múltiplas URLs
    - Permite escolher entre áudio ou vídeo
    - Pode retornar arquivo único ou ZIP
    """
    output_dir = ensure_output_dir()
    
    try:
        results = []
        successful_downloads = []
        failed_downloads = []
        
        # Processar cada URL
        for url in request.urls:
            result = download_single_item(url, request.download_type, output_dir)
            results.append(result)
            
            if result["success"]:
                successful_downloads.append(result["file_path"])
            else:
                failed_downloads.append(result)
        
        # Se não houve downloads com sucesso
        if not successful_downloads:
            error_details = [f["error"] for f in failed_downloads]
            raise HTTPException(
                status_code=400, 
                detail=f"Nenhum download foi bem-sucedido. Erros: {'; '.join(error_details)}"
            )
        
        # Retornar resultado baseado no formato solicitado
        if request.output_format == "single" and len(successful_downloads) == 1:
            # Retorno de arquivo único
            file_path = successful_downloads[0]
            media_type = "audio/mp3" if request.download_type == "audio" else "video/mp4"
            filename = os.path.basename(file_path)
            
            return FileResponse(
                file_path, 
                media_type=media_type, 
                filename=filename
            )
        
        else:
            # Retorno como ZIP
            zip_name = f"{'musicas' if request.download_type == 'audio' else 'videos'}.zip"
            zip_path = create_zip_from_files(successful_downloads, output_dir, zip_name)
            
            # Limpar arquivos individuais após criar o ZIP
            for file_path in successful_downloads:
                try:
                    os.remove(file_path)
                except Exception as e:
                    logging.warning(f"Não foi possível remover arquivo {file_path}: {e}")
            
            return FileResponse(
                zip_path, 
                media_type="application/zip", 
                filename=zip_name
            )
    
    except HTTPException:
        raise
    except Exception as e:
        error_msg = f"Erro geral no processamento: {str(e)}"
        logging.error(error_msg)
        raise HTTPException(status_code=500, detail=error_msg)

# Rota de health check
@router.get("/health")
async def health_check():
    """Verifica se a API está funcionando."""
    return {"status": "ok", "message": "API de download funcionando"}

