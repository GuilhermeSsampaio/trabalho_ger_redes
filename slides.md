# Script para Slides - Gerenciador de Downloads do YouTube

## 🎯 Estrutura da Apresentação (10-15 slides)

---

## SLIDE 1: Título e Apresentação

**Título:** Gerenciador de Downloads do YouTube
**Subtítulo:** Aplicação Fullstack para Download de Mídia
**Autores:**

- Guilherme S. Sampaio (Backend & DevOps)
- Pedro Mota (Frontend & Testes)
  **Data:** Novembro 2025

---

## SLIDE 2: Visão Geral do Sistema

**Título:** O que é o Sistema?
**Conteúdo:**

- Aplicação web para download de vídeos e músicas do YouTube
- Interface moderna e responsiva
- Conversão automática para MP3 e MP4
- Download individual ou em lote (ZIP)
- Feedback em tempo real via WebSocket

**Visual:** Screenshot da tela principal da aplicação

---

## SLIDE 3: Funcionalidades Principais

**Título:** Principais Funcionalidades
**Lista com ícones:**

- 🔍 Pesquisa integrada de vídeos (YouTube API)
- 🎵 Download de áudio (conversão automática para MP3)
- 🎬 Download de vídeo (qualidade até 4K)
- 📦 Download em lote (múltiplos arquivos em ZIP)
- 🌐 Comunicação em tempo real (WebSocket)
- 📱 Interface responsiva (mobile-friendly)
- 🔄 Hot reload para desenvolvimento

---

## SLIDE 4: Arquitetura do Sistema - Visão Geral

**Título:** Modelo Cliente-Servidor
**Diagrama:**

```
┌─────────────────┐    HTTP/WebSocket    ┌─────────────────┐
│   FRONTEND      │◄──────────────────►│    BACKEND      │
│   React + Vite  │                    │  FastAPI        │
│   Port: 5173    │                    │  Port: 8000     │
└─────────────────┘                    └─────────────────┘
                                                │
                                                ▼
                                       ┌─────────────────┐
                                       │   YOUTUBE API   │
                                       │   pytubefix     │
                                       │   MoviePy       │
                                       └─────────────────┘
```

---

## SLIDE 5: Tecnologias - Backend (3,0 pts)

**Título:** Backend - FastAPI e Tecnologias
**Bibliotecas Principais:**

- **FastAPI**: Framework web assíncrono moderno
- **pytubefix**: Extração de mídia do YouTube
- **MoviePy**: Processamento e conversão de áudio/vídeo
- **Pydantic**: Validação de dados
- **WebSockets**: Comunicação em tempo real
- **Uvicorn**: Servidor ASGI de alta performance

**Recursos:**

- API REST com documentação automática
- Suporte a IPv4 e IPv6
- Containerização com Docker
- Validação robusta de URLs

---

## SLIDE 6: Demonstração do Backend

**Título:** Backend em Funcionamento
**Mostrar:**

- Containers rodando (docker-compose logs)
- Portas abertas (8000 para API, WebSocket)
- Documentação automática em `/docs`
- Exemplo de requisição POST para `/download/`
- Logs de download em tempo real

**Código exemplo:**

```python
@router.post("/download/")
async def download_content(request: DownloadRequest):
    # Processar URLs
    # Baixar e converter mídia
    # Notificar via WebSocket
    # Retornar arquivo ou ZIP
```

---

## SLIDE 7: Organização do Backend

**Título:** Estrutura e Organização do Backend
**Diagrama da estrutura:**

```
backend/
├── main.py                 # App principal + WebSocket
├── routes/
│   └── download_routes.py  # Endpoints de download
└── utils/
    ├── utils.py           # Funções de download
    └── websocket_manager.py # Gerenciador WebSocket
```

**Funcionalidades por módulo:**

- `main.py`: CORS, WebSocket, servidor
- `download_routes.py`: API unificada de download
- `utils.py`: Lógica de negócio, validação
- `websocket_manager.py`: Notificações em tempo real

---

## SLIDE 8: WebSocket em Ação

**Título:** Comunicação em Tempo Real
**Fluxo WebSocket:**

1. Cliente conecta em `ws://localhost:8000/ws`
2. Backend notifica progresso do download
3. Frontend atualiza interface em tempo real
4. Notificação de conclusão e limpeza automática

**Tipos de mensagens:**

- `download_progress`: Progresso atual
- `download_complete`: Download finalizado
- `file_cleaned`: Arquivo removido automaticamente

**Demo:** Mostrar console do navegador com mensagens WebSocket

---

## SLIDE 9: Tecnologias - Frontend (3,0 pts)

**Título:** Frontend - React e Interface Moderna
**Tecnologias:**

- **React 19**: Biblioteca de interface moderna
- **Vite**: Build tool rápido com hot reload
- **Bootstrap 5**: Framework CSS responsivo
- **Custom Hooks**: Gerenciamento de estado
- **WebSocket Client**: Integração em tempo real

**Componentes Principais:**

- `App.jsx`: Componente raiz
- `DownloadSection.jsx`: Seção principal
- `SearchSection.jsx`: Interface de pesquisa
- `useDownloadManager.js`: Hook customizado

---

## SLIDE 10: Interface Gráfica - Telas Principais

**Título:** Interface do Usuário
**Screenshots das principais telas:**

1. **Tela inicial**: Hero section com call-to-action
2. **Seção de pesquisa**: Campo de busca + resultados
3. **Lista de vídeos**: Vídeos selecionados
4. **Download em progresso**: Loading com feedback
5. **Interface mobile**: Layout responsivo

**Destaque:** Design moderno, intuitivo e acessível

---

## SLIDE 11: Demonstração do Frontend

**Título:** Frontend em Funcionamento
**Fluxo de demonstração:**

1. Pesquisar vídeo na interface
2. Selecionar múltiplos vídeos
3. Escolher tipo (áudio/vídeo)
4. Iniciar download
5. Acompanhar progresso em tempo real
6. Download automático do arquivo

**Mostrar:** Responsividade, integração com backend, feedback visual

---

## SLIDE 12: Integração Frontend ↔ Backend

**Título:** Comunicação Entre Componentes
**Fluxo de dados:**

```
1. Frontend → POST /download/ → Backend
2. Backend → pytubefix → YouTube
3. YouTube → mídia → MoviePy (conversão)
4. Backend → WebSocket → Frontend (progresso)
5. Backend → arquivo/ZIP → Frontend (download)
```

**Demonstrar:**

- Requisições HTTP (Network tab)
- Mensagens WebSocket (Console)
- Download de arquivos (Browser)

---

## SLIDE 13: Docker e DevOps

**Título:** Containerização e IPv6
**Containers:**

- **Backend**: Python 3.12-slim + FastAPI
- **Frontend**: Node.js 20-alpine + Vite
- **Hot Reload**: Desenvolvimento otimizado

**IPv6 Support:**

- Dual-stack configuration
- Docker Compose específico para IPv6
- Backend listening em `::` (IPv6)

**Mostrar:**

```bash
docker-compose up --build                    # IPv4
docker-compose -f Docker-compose-ipv6.yaml up # IPv6
```

---

## SLIDE 14: Arquitetura Técnica Completa

**Título:** Diagrama de Arquitetura Final
**Diagrama detalhado:**

```
┌─────────────────┐   HTTP/WS   ┌─────────────────┐   API   ┌─────────────┐
│   React App     │◄───────────►│   FastAPI       │────────►│  YouTube    │
│   (Frontend)    │             │   (Backend)     │         │   API       │
│   - Bootstrap   │             │   - pytubefix   │         └─────────────┘
│   - WebSocket   │             │   - MoviePy     │                │
│   - Vite        │             │   - WebSocket   │                ▼
└─────────────────┘             └─────────────────┘         ┌─────────────┐
         │                               │                  │  Downloads  │
         │                               │                  │   + ZIP     │
         ▼                               ▼                  └─────────────┘
┌─────────────────┐             ┌─────────────────┐
│   Docker        │             │   Docker        │
│   Node:20       │             │   Python:3.12   │
└─────────────────┘             └─────────────────┘
```

---

## SLIDE 15: Resultados e Capricho (1,0 pt)

**Título:** Qualidade e Profissionalismo
**Pontos de destaque:**

- ✅ Código bem organizado e comentado
- ✅ Interface moderna e profissional
- ✅ README.md completo e detalhado
- ✅ Hot reload funcionando perfeitamente
- ✅ WebSocket implementado
- ✅ Suporte IPv6 configurado
- ✅ Containerização completa
- ✅ Arquitetura escalável

**Métricas:**

- Tempo de resposta: < 2s
- Interface responsiva: Mobile + Desktop
- Feedback em tempo real
- Downloads automáticos

---

## SLIDE 16: Conclusão e Próximos Passos

**Título:** Conclusão
**O que foi alcançado:**

- Sistema fullstack completo e funcional
- Interface moderna e intuitiva
- Comunicação em tempo real
- Suporte a múltiplos formatos
- Containerização e IPv6

**Possíveis melhorias futuras:**

- Autenticação de usuários
- Histórico de downloads
- Playlists personalizadas
- Download de playlists inteiras
- API pública

**Agradecimentos**

---

## 🎥 Dicas para Apresentação

### Roteiro Sugerido:

1. **Guilherme (5 min)**: Slides 1-8 (Visão geral, Backend, WebSocket)
2. **Pedro (5 min)**: Slides 9-12 (Frontend, Interface, Integração)
3. **Ambos (3 min)**: Slides 13-16 (Docker, Arquitetura, Conclusão)

### Demonstrações ao Vivo:

- Mostrar aplicação rodando
- Fazer download de um vídeo
- Mostrar logs do Docker
- Demonstrar responsividade mobile
- Exibir WebSocket no console

### Recursos Visuais:

- Screenshots das telas principais
- GIFs do sistema funcionando
- Diagramas de arquitetura
- Código-fonte destacado
- Logs em tempo real

### Preparação:

- Testar tudo antes da apresentação
- Ter backup dos screenshots/GIFs
- Preparar ambiente de demonstração
- Ensaiar transições entre apresentadores
