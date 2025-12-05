# Gerenciador de Downloads do YouTube

Este projeto é uma aplicação fullstack para baixar músicas e vídeos do YouTube, com backend em FastAPI (Python) e frontend em React (Vite). Oferece uma interface moderna para pesquisar vídeos, selecionar múltiplos links ou inserir URLs manualmente para download em MP3 ou MP4.

### 📌 Observação

Comandos diretos para rodar o projeto estão em `comandos.txt` (na raiz do repositório). Consulte esse arquivo para instruções rápidas sobre Docker, execução local e uso de IPv6.

## 🎯 Demonstração

- **Interface Responsiva**: Design moderno e intuitivo
- **Pesquisa Integrada**: Busque vídeos diretamente na aplicação
- **Download Flexível**: Escolha entre áudio (MP3) ou vídeo (MP4)
- **Feedback em Tempo Real**: Acompanhe o progresso via WebSocket

## ✨ Funcionalidades

- 🔍 **Pesquisa integrada**: Busca de vídeos usando a API do YouTube
- 🎵 **Download de áudio**: Conversão automática para MP3 com MoviePy
- 🎬 **Download de vídeo**: Baixe vídeos diretamente do Yt
- 📦 **Download em lote**: Múltiplos arquivos compactados em ZIP
- 🌐 **WebSocket em tempo real**: Feedback de progresso e notificações
- 📱 **Interface responsiva**: Design moderno com Bootstrap
- 🔄 **Hot reload**: Desenvolvimento otimizado com Docker
- 🌍 **Suporte IPv6**: Configuração dual-stack opcional

## 📁 Estrutura do Projeto

```
├── backend/                    # FastAPI Backend
│   ├── main.py                # Aplicação principal e WebSocket
│   ├── requirements.txt       # Dependências Python
│   ├── Dockerfile            # Container do backend
│   ├── routes/
│   │   └── download_routes.py # Rotas de download unificadas
│   └── utils/
│       ├── utils.py          # Funções de download e validação
│       └── websocket_manager.py # Gerenciador WebSocket
├── interface/                 # Frontend React
│   ├── src/
│   │   ├── App.jsx           # Componente principal
│   │   ├── components/       # Componentes React
│   │   ├── hooks/           # Custom hooks (useDownloadManager)
│   │   ├── config/          # Constantes e configurações
│   │   └── api/             # Cliente API (useapi.js)
│   ├── package.json         # Dependências Node.js
│   └── Dockerfile          # Container do frontend
├── Docker-compose.yaml      # Orquestração de containers
├── Docker-compose-ipv6.yaml # Configuração com IPv6
└── .env.example            # Exemplo de variáveis de ambiente
```

## 🚀 Como Executar

### Pré-requisitos

- **Python 3.12+**
- **Node.js 20+**
- **Docker e Docker Compose** (recomendado)
- **Chave API do YouTube** (para pesquisas)

### 🐳 Executar com Docker (Recomendado)

1. **Clone o repositório**:

```bash
git clone https://github.com/GuilhermeSsampaio/trabalho_ger_redes.git
cd trabalho_ger_redes
```

2. **Configure as variáveis de ambiente**:

```bash
cp .env.example .env
# Edite o arquivo .env e adicione sua YOUTUBE_API_KEY
```

3. **Execute com Docker Compose**:

```bash
# Construir e executar para ipv4 no backend
docker compose up --build

# Para usar ipv6
docker compose -f ./Docker-compose-ipv6.yaml up --build

# Apenas executar (após primeira build)
docker compose up
```

4. **Acesse a aplicação**:

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- Documentação da API: http://localhost:8000/docs

### 💻 Executar Localmente

#### Backend (FastAPI)

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/macOS
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend (React + Vite)

```bash
cd interface
npm install
npm run dev
```

## ⚙️ Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
# Chave da API do YouTube (obrigatória para pesquisas)
VITE_YOUTUBE_API_KEY=your_youtube_api_key_here

# Configurações opcionais
VITE_USE_IPV6=true
VITE_DEV_MODE=true
```

### Como obter a YouTube API Key

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Ative a **YouTube Data API v3**
4. Crie credenciais (API Key)
5. Configure as restrições se necessário

### Suporte IPv6

Para habilitar IPv6, use o arquivo de composição específico:

```bash
docker-compose -f Docker-compose-ipv6.yaml up --build
```

## 🏗️ Arquitetura

### Backend (FastAPI)

- **Framework**: FastAPI com suporte assíncrono
- **Download**: pytubefix para extração de mídia do YouTube
- **Conversão**: MoviePy para conversão MP3/MP4
- **WebSocket**: Comunicação em tempo real para progresso
- **Validação**: Pydantic para validação de dados
- **Container**: Docker com Python 3.12-slim

### Frontend (React + Vite)

- **Framework**: React 19 com Vite
- **UI**: Bootstrap 5 + CSS customizado
- **Estado**: Custom hooks para gerenciamento
- **API**: Cliente HTTP personalizado (useapi.js)
- **WebSocket**: Integração em tempo real
- **Container**: Docker com Node.js 20-alpine

### Comunicação

- **REST API**: Endpoints para download e health check
- **WebSocket**: Notificações de progresso e conclusão
- **CORS**: Configurado para desenvolvimento

### Fluxo de Dados

```
Frontend (React)
    ↓ HTTP Request
Backend (FastAPI)
    ↓ Download
YouTube (pytubefix)
    ↓ Conversão
MoviePy (MP3/MP4)
    ↓ WebSocket
Frontend (Notificação)
```

## 🛠️ Tecnologias

### Backend

- **FastAPI** - Framework web assíncrono
- **pytubefix** - Download de vídeos do YouTube
- **MoviePy** - Processamento e conversão de mídia
- **Pydantic** - Validação de dados
- **WebSockets** - Comunicação em tempo real
- **Uvicorn** - Servidor ASGI

### Frontend

- **React 19** - Biblioteca de interface
- **Vite** - Build tool e dev server
- **Bootstrap 5** - Framework CSS
- **Bootstrap Icons** - Biblioteca de ícones

### DevOps

- **Docker** - Containerização
- **Docker Compose** - Orquestração
- **Hot Reload** - Desenvolvimento otimizado

### APIs Externas

- **YouTube Data API v3** - Pesquisa de vídeos

## 📋 API Endpoints

### Download

- `POST /download/` - Download unificado
  - Body: `{urls: string[], download_type: "audio"|"video", output_format: "single"|"zip"}`
  - Response: Arquivo direto ou JSON com informações

### Health Check

- `GET /health` - Status da API
- `GET /` - Status básico

### WebSocket

- `WS /ws` - Conexão em tempo real
  - Eventos: `download_complete`, `download_progress`, `file_cleaned`

## 🧪 Desenvolvimento

### Scripts Disponíveis

```bash
# Frontend
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview da build

# Docker
npm run build_app    # Construir e executar containers
npm run start_app    # Executar containers existentes
```

### Estrutura de Componentes

- `App.jsx` - Componente principal
- `DownloadSection.jsx` - Seção principal de downloads
- `SearchSection.jsx` - Interface de pesquisa
- `VideoList.jsx` - Lista de vídeos selecionados
- `useDownloadManager.js` - Hook customizado para lógica de negócio

## 🐛 Solução de Problemas

### Problemas Comuns

1. **Erro de CORS**: Verifique se o backend está rodando na porta 8000
2. **API Key inválida**: Configure corretamente a `VITE_YOUTUBE_API_KEY`
3. **Hot reload não funciona**: Use `usePolling: true` no Vite config (já configurado)
4. **Download falha**: Verifique se a URL do YouTube é válida e acessível
5. **Porta ocupada**: Certifique-se de que as portas 8000 e 5173 estão livres
6. **Problemas de permissão**: Execute o Docker como administrador se necessário

### Logs

```bash
# Ver logs dos containers
docker-compose logs backend
docker-compose logs frontend

# Logs em tempo real
docker-compose logs -f
```

## 📄 Licença

MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👥 Contribuição

Contribuições são bem-vindas! Por favor:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

Se você encontrar algum problema ou tiver dúvidas:

- Abra uma [issue](https://github.com/GuilhermeSsampaio/trabalho_ger_redes/issues)
- Entre em contato com os desenvolvedores

---

## 👥 Equipe de Desenvolvimento

- **Guilherme S. Sampaio**: Backend, WebSocket, Docker e DevOps
- **Pedro Mota**: Frontend, Interface de Usuário e Testes

---

⭐ Deixe uma estrela se este projeto foi útil para você!
