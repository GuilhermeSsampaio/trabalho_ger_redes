import sys
import os
import json
import zipfile
from pytubefix import YouTube
import moviepy.editor as mp
import re
import logging

# Configurar logging para depuração
logging.basicConfig(
    level=logging.DEBUG, format="%(asctime)s - %(levelname)s - %(message)s"
)


def sanitize_filename(name):
    """Remove caracteres inválidos para nomes de arquivo."""
    return re.sub(r'[\\/*?:"<>|]', "", name)


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


def create_zip(mp3_files, output_dir):
    """Cria um arquivo ZIP com os arquivos MP3 baixados."""
    if not mp3_files:
        return None

    zip_path = os.path.join(output_dir, "downloaded_music.zip")
    with zipfile.ZipFile(zip_path, "w") as zipf:
        for file_path in mp3_files:
            zipf.write(file_path, os.path.basename(file_path))

    logging.info(f"Arquivo ZIP criado: {zip_path}")
    return zip_path


def main():
    # Ler os parâmetros JSON da entrada padrão
    json_input = sys.stdin.read()
    try:
        data = json.loads(json_input)
        links = data.get("links", [])
        download_type = data.get("type", "audio")  # Tipo de download (padrão: áudio)

        # Diretório para downloads
        output_dir = os.path.join(os.path.expanduser("~"), "Downloads", "YTMusic")
        os.makedirs(output_dir, exist_ok=True)

        # Baixar os arquivos
        results = []
        successful_downloads = []

        for link in links:
            result = download_music_or_video(link, output_dir, download_type)
            results.append(result)

            if "success" in result:
                successful_downloads.append(result["success"])

        # Criar ZIP se houver downloads com sucesso
        # zip_path = None
        # if successful_downloads:
        #     zip_path = create_zip(successful_downloads, output_dir)

        # Retornar os resultados como JSON
        response = {
            "results": results,
            "output_dir": output_dir,  # Incluir o diretório de saída na resposta
            "message": f"Download concluído: {len(successful_downloads)} de {len(links)} vídeos baixados com sucesso.",
        }

        print(json.dumps(response))

    except Exception as e:
        logging.exception("Erro ao processar a solicitação")
        error_response = {
            "error": str(e),
            "message": "Ocorreu um erro ao processar sua solicitação.",
        }
        print(json.dumps(error_response), file=sys.stderr)


if __name__ == "__main__":
    main()
