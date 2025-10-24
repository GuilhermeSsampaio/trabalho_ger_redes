# Gerenciador de Downloads do YouTube

Este projeto é uma aplicação fullstack para baixar músicas e vídeos do YouTube, com backend em FastAPI (Python) e frontend em React (Vite). Permite pesquisar vídeos, selecionar múltiplos links ou inserir URLs manualmente para baixar áudio (MP3) ou vídeo (MP4).

## Funcionalidades

- Pesquisa de vídeos do YouTube (via API do YouTube)
- Download de áudio (MP3) ou vídeo (MP4) de um ou vários links
- Download de playlists (lista de URLs)
- Interface moderna e responsiva
- Backend preparado para rodar em Docker

## Estrutura do Projeto

```
├── backend/           # FastAPI, scripts de download, rotas
├── interface/         # Frontend React (Vite)
├── frontend_antigo/   # Versão antiga do frontend (opcional)
├── Docker-compose.yaml
├── tarefas.md         # Lista de tarefas e ideias
└── readme.md
```

## Como rodar localmente

### Pré-requisitos

- Python 3.10+
- Node.js 18+
- Docker (opcional)

### Backend (FastAPI)

```bash
cd backend
python -m venv venv
# Ative o ambiente virtual:
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend (React)

```bash
cd interface
npm install
npm run dev
```

Acesse o frontend em: http://localhost:5173

> **Obs:** O backend roda por padrão em http://localhost:8000. Configure a variável `VITE_API_URL` no `.env` do frontend se necessário.

### Docker Compose

Para rodar tudo com Docker Compose:

```bash
docker-compose up --build
```

## Variáveis de Ambiente

- `VITE_API_URL` (frontend): URL da API FastAPI
- `VITE_YOUTUBE_API_KEY` (frontend): Chave da API do YouTube para buscas

## Estrutura das Pastas

- `backend/routes/`: Rotas FastAPI
- `backend/scripts/`: Scripts de download (pytubefix, moviepy)
- `interface/src/`: Código React
- `interface/api/useapi.js`: Utilitário para consumir a API FastAPI

## Tecnologias

- **Backend:** FastAPI, pytubefix, moviepy
- **Frontend:** React, Vite, Bootstrap
- **Container:** Docker, Docker Compose

## Licença

MIT

---

Desenvolvido por Guilherme S. Sampaio e Pedro Mota
