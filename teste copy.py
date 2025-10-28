import sys
import os
import json
import zipfile
from pytubefix import YouTube
import moviepy.editor as mp
import re
import logging

logging.basicConfig(level=logging.DEBUG)

def download_music_or_video(url, output_dir, download_type):
    """Baixa o áudio ou vídeo completo do YouTube."""
    try:
        logging.info(f"Processando URL: {url}")
        yt = YouTube(url)

        if download_type == "audio":
            logging.info("Baixando somente áudio...")
            stream = yt.streams.filter(only_audio=True).first()
        else:
            logging.info("Baixando vídeo completo...")
            stream = (
                yt.streams.filter(progressive=True, file_extension="mp4")
                .order_by("resolution")
                .desc()
                .first()
            )

        if not stream:
            raise ValueError(f"Não foi possível encontrar um stream para {url}")

        # Baixar o arquivo
        output_file = stream.download(output_dir)

        if download_type == "audio":
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
        else:
            logging.info(f"Download de vídeo concluído: {output_file}")
            return {"success": output_file, "title": yt.title}
    except Exception as e:
        error_msg = f"Erro ao baixar {url}: {str(e)}"
        logging.error(error_msg)
        return {"error": error_msg}
    
url= "https://www.youtube.com/watch?v=Ahf2B_eZUc4"
url = re.sub(r"&.*", "", url)
download_music_or_video(url, "./downloads", "audio")