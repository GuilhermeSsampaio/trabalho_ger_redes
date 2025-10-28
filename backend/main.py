from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
import re
import logging
from pytubefix import YouTube
import moviepy.editor as mp

logging.basicConfig(level=logging.DEBUG)

app = FastAPI()

class DownloadRequest(BaseModel):
    url: str

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

        logging.info(f"Download e conversão concluídos: {mp3_path}")
        return {"success": mp3_path, "title": yt.title}
    except Exception as e:
        error_msg = f"Erro ao baixar {url}: {str(e)}"
        logging.error(error_msg)
        raise HTTPException(status_code=400, detail=error_msg)