from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
import re
import logging
from pytubefix import YouTube
import moviepy.editor as mp
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from zipfile import ZipFile
import uuid
from typing import List

logging.basicConfig(level=logging.DEBUG)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permitir todas as origens
    allow_credentials=True,
    allow_methods=["*"],  # Permitir todos os métodos HTTP
    allow_headers=["*"],  # Permitir todos os cabeçalhos
)

class DownloadRequest(BaseModel):
    url: str

class MultiDownloadRequest(BaseModel):
    urls: List[str]

# Lista para armazenar os caminhos dos arquivos baixados
downloaded_files = []

@app.post("/download-audio/")
async def download_audio(request: DownloadRequest):
    """Rota para baixar o áudio de um vídeo do YouTube."""
    url = request.url
    url = re.sub(r"&.*", "", url)  # Remove parâmetros extras da URL
    output_dir = "./downloads"

    try:
        logging.info(f"Processando URL: {url}")
        yt = YouTube(url)

        # Baixando somente áudio
        logging.info("Baixando somente áudio...")
        stream = yt.streams.filter(only_audio=True).first()

        if not stream:
            raise ValueError(f"Não foi possível encontrar um stream para {url}")

        # Baixar o arquivo
        output_file = stream.download(output_dir)

        # Converter para MP3
        mp3_path = os.path.join(
            output_dir, os.path.splitext(os.path.basename(output_file))[0] + ".mp3"
        )
        audio_clip = mp.AudioFileClip(output_file)
        audio_clip.write_audiofile(mp3_path)
        audio_clip.close()
        os.remove(output_file)  # Remover o arquivo original

        # Adicionar o arquivo MP3 à lista de arquivos baixados
        downloaded_files.append(mp3_path)

        logging.info(f"Download e conversão concluídos: {mp3_path}")
        return {"success": mp3_path, "title": yt.title}
    except Exception as e:
        error_msg = f"Erro ao baixar {url}: {str(e)}"
        logging.error(error_msg)
        raise HTTPException(status_code=400, detail=error_msg)


@app.get("/download-zip/")
async def download_zip():
    """Rota para criar e servir um arquivo ZIP com todas as músicas baixadas."""
    if not downloaded_files:
        raise HTTPException(status_code=400, detail="Nenhum arquivo disponível para download.")

    # Criar um arquivo ZIP temporário
    zip_filename = f"./downloads/{uuid.uuid4().hex}.zip"
    with ZipFile(zip_filename, "w") as zipf:
        for file in downloaded_files:
            zipf.write(file, os.path.basename(file))  # Adicionar o arquivo ao ZIP

    # Limpar a lista de arquivos baixados após criar o ZIP
    downloaded_files.clear()

    # Retornar o arquivo ZIP para o cliente
    return FileResponse(zip_filename, media_type="application/zip", filename="musicas.zip")


@app.post("/download-multiple-audio/")
async def download_multiple_audio(request: MultiDownloadRequest):
    """Rota para baixar múltiplos áudios do YouTube."""
    output_dir = "./downloads"
    zip_filename = f"./downloads/{uuid.uuid4().hex}.zip"

    try:
        with ZipFile(zip_filename, "w") as zipf:
            for url in request.urls:
                url = re.sub(r"&.*", "", url)  # Remove parâmetros extras da URL
                logging.info(f"Processando URL: {url}")
                yt = YouTube(url)

                # Baixando somente áudio
                logging.info("Baixando somente áudio...")
                stream = yt.streams.filter(only_audio=True).first()

                if not stream:
                    raise ValueError(f"Não foi possível encontrar um stream para {url}")

                # Baixar o arquivo
                output_file = stream.download(output_dir)

                # Converter para MP3
                mp3_path = os.path.join(
                    output_dir, os.path.splitext(os.path.basename(output_file))[0] + ".mp3"
                )
                audio_clip = mp.AudioFileClip(output_file)
                audio_clip.write_audiofile(mp3_path)
                audio_clip.close()
                os.remove(output_file)  # Remover o arquivo original

                # Adicionar o arquivo MP3 ao ZIP
                zipf.write(mp3_path, os.path.basename(mp3_path))

        logging.info(f"ZIP criado com sucesso: {zip_filename}")
        return FileResponse(zip_filename, media_type="application/zip", filename="musicas.zip")
    except Exception as e:
        error_msg = f"Erro ao processar os downloads: {str(e)}"
        logging.error(error_msg)
        raise HTTPException(status_code=400, detail=error_msg)

@app.post("/download-video/")
async def download_video(request: DownloadRequest):
    """Rota para baixar o vídeo completo do YouTube."""
    url = request.url
    url = re.sub(r"&.*", "", url)  # Remove parâmetros extras da URL
    output_dir = "./downloads"

    try:
        logging.info(f"Processando URL: {url}")
        yt = YouTube(url)

        # Baixando vídeo completo
        logging.info("Baixando vídeo completo...")
        stream = yt.streams.filter(progressive=True, file_extension="mp4").order_by("resolution").desc().first()

        if not stream:
            raise ValueError(f"Não foi possível encontrar um stream para {url}")

        # Baixar o arquivo
        video_path = stream.download(output_dir)

        logging.info(f"Download concluído: {video_path}")
        return FileResponse(video_path, media_type="video/mp4", filename=os.path.basename(video_path))
    except Exception as e:
        error_msg = f"Erro ao baixar {url}: {str(e)}"
        logging.error(error_msg)
        raise HTTPException(status_code=400, detail=error_msg)

@app.post("/download-multiple-videos/")
async def download_multiple_videos(request: MultiDownloadRequest):
    """Rota para baixar múltiplos vídeos do YouTube e servir como ZIP."""
    output_dir = "./downloads"
    zip_filename = f"./downloads/{uuid.uuid4().hex}-videos.zip"

    try:
        with ZipFile(zip_filename, "w") as zipf:
            for url in request.urls:
                url = re.sub(r"&.*", "", url)  # Remove parâmetros extras da URL
                logging.info(f"Processando URL: {url}")
                yt = YouTube(url)

                # Baixando vídeo completo
                logging.info("Baixando vídeo completo...")
                stream = yt.streams.filter(progressive=True, file_extension="mp4").order_by("resolution").desc().first()

                if not stream:
                    raise ValueError(f"Não foi possível encontrar um stream para {url}")

                # Baixar o arquivo
                video_path = stream.download(output_dir)

                # Adicionar o arquivo MP4 ao ZIP
                zipf.write(video_path, os.path.basename(video_path))

        logging.info(f"ZIP criado com sucesso: {zip_filename}")
        return FileResponse(zip_filename, media_type="application/zip", filename="videos.zip")
    except Exception as e:
        error_msg = f"Erro ao processar os downloads de vídeos: {str(e)}"
        logging.error(error_msg)
        raise HTTPException(status_code=400, detail=error_msg)