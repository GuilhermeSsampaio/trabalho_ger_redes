import os
import re
import logging
import uuid
from typing import List
from zipfile import ZipFile
from pytubefix import YouTube
import moviepy.editor as mp
from pydantic import BaseModel, validator
from typing import Literal

# Configuração de logging
logging.basicConfig(level=logging.DEBUG)

# Modelos Pydantic
class DownloadRequest(BaseModel):
    urls: List[str]
    download_type: Literal["audio", "video"] = "audio"
    output_format: Literal["single", "zip"] = "single"
    
    @validator('urls')
    def validate_urls(cls, v):
        if not v:
            raise ValueError('Pelo menos uma URL deve ser fornecida')
        
        youtube_pattern = re.compile(
            r'(https?://)?(www\.)?(youtube|youtu|youtube-nocookie)\.(com|be)/'
            r'(watch\?v=|embed/|v/|.+\?v=)?([^&=%\?]{11})'
        )
        
        for url in v:
            if not youtube_pattern.match(url):
                raise ValueError(f'URL inválida do YouTube: {url}')
        return v

# Funções Helper
def sanitize_url(url: str) -> str:
    """Remove parâmetros extras da URL do YouTube."""
    return re.sub(r"&.*", "", url)

def ensure_output_dir(output_dir: str = "./downloads") -> str:
    """Garante que o diretório de output existe."""
    os.makedirs(output_dir, exist_ok=True)
    return output_dir

def download_single_item(url: str, download_type: str, output_dir: str) -> dict:
    """
    Baixa um único item (áudio ou vídeo) do YouTube.
    
    Args:
        url: URL do YouTube
        download_type: 'audio' ou 'video'
        output_dir: Diretório de destino
    
    Returns:
        dict com informações do download ou erro
    """
    try:
        sanitized_url = sanitize_url(url)
        logging.info(f"Processando URL: {sanitized_url}")
        yt = YouTube(sanitized_url)

        if download_type == "audio":
            stream = yt.streams.filter(only_audio=True).first()
            if not stream:
                raise ValueError(f"Não foi possível encontrar stream de áudio para {sanitized_url}")
            
            output_file = stream.download(output_dir)
            
            # Converter para MP3
            mp3_path = os.path.join(
                output_dir, os.path.splitext(os.path.basename(output_file))[0] + ".mp3"
            )
            audio_clip = mp.AudioFileClip(output_file)
            audio_clip.write_audiofile(mp3_path)
            audio_clip.close()
            os.remove(output_file)
            
            return {
                "success": True,
                "file_path": mp3_path,
                "title": yt.title,
                "type": "audio"
            }
        
        else:  # video
            stream = yt.streams.filter(
                progressive=True, 
                file_extension="mp4"
            ).order_by("resolution").desc().first()
            
            if not stream:
                raise ValueError(f"Não foi possível encontrar stream de vídeo para {sanitized_url}")
            
            video_path = stream.download(output_dir)
            
            return {
                "success": True,
                "file_path": video_path,
                "title": yt.title,
                "type": "video"
            }
            
    except Exception as e:
        error_msg = f"Erro ao baixar {url}: {str(e)}"
        logging.error(error_msg)
        return {
            "success": False,
            "error": error_msg,
            "url": url
        }

def create_zip_from_files(file_paths: List[str], output_dir: str, zip_name: str = None) -> str:
    """
    Cria um arquivo ZIP com os arquivos fornecidos.
    
    Args:
        file_paths: Lista de caminhos dos arquivos
        output_dir: Diretório onde criar o ZIP
        zip_name: Nome do arquivo ZIP (opcional)
    
    Returns:
        Caminho do arquivo ZIP criado
    """
    if not zip_name:
        zip_name = f"{uuid.uuid4().hex}.zip"
    
    zip_path = os.path.join(output_dir, zip_name)
    
    with ZipFile(zip_path, "w") as zipf:
        for file_path in file_paths:
            if os.path.exists(file_path):
                zipf.write(file_path, os.path.basename(file_path))
    
    return zip_path
