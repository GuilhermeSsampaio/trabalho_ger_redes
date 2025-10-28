# from fastapi import APIRouter
# from fastapi.responses import FileResponse
# from scripts.download import download_music_or_video, create_zip

# router = APIRouter()

# @router.post("/download_video/")
# async def download_video(video_url: str):
#     # Lógica para baixar o vídeo do YouTube
#     result = download_music_or_video(video_url, "./downloads", "video")
#     return result

# @router.post("/download_music/")
# async def download_music(video_url: str):
#     # Lógica para baixar apenas o áudio do vídeo do YouTube
#     result = download_music_or_video(video_url, "./downloads", "audio")
#     return result

# @router.post("/download_playlist/")
# async def download_playlist(playlist_urls: list[str]):
#     # Diretório para salvar os downloads
#     output_dir = "./downloads"

#     # Lista para armazenar os arquivos baixados
#     downloaded_files = []

#     # Simular o download de cada URL da playlist
#     for url in playlist_urls:
#         result = download_music_or_video(url, output_dir, "audio")
#         if "success" in result:
#             downloaded_files.append(result["success"])

#     # Criar o arquivo ZIP com os downloads
#     zip_path = create_zip(downloaded_files, output_dir)

#     if zip_path:
#         # Retornar o arquivo ZIP como resposta
#         return FileResponse(zip_path, media_type="application/zip", filename="playlist_download.zip")

#     return {"error": "Não foi possível criar o arquivo ZIP."}

# @router.post("/download_from_urls/")
# async def download_from_urls(urls: list[str], download_type: str = "audio"):
#     # Diretório para salvar os downloads
#     output_dir = "./downloads"

#     # Lista para armazenar os resultados
#     results = []

#     # Processar cada URL
#     for url in urls:
#         result = download_music_or_video(url, output_dir, download_type)
#         results.append(result)

#     return {"results": results, "message": f"{len(results)} arquivos processados."}

from pytubefix import YouTube
from pytubefix.cli import on_progress

url = "https://www.youtube.com/watch?v=vx2u5uUu3DE"

yt = YouTube(url, on_progress_callback=on_progress)
print(yt.title)

ys = yt.streams.get_audio_only()
ys.download()