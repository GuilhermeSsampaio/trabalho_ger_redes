# 🎥 Gerenciador de Downloads do YouTube

## 📋 Introdução

O **Gerenciador de Downloads do YouTube** é uma aplicação web fullstack moderna que permite aos usuários baixar vídeos e áudios diretamente do YouTube de forma simples e eficiente. Desenvolvido como um projeto acadêmico para a disciplina de Gerenciamento de Redes, o sistema demonstra a implementação de uma arquitetura cliente-servidor robusta com comunicação em tempo real.

## 🎯 Tema Central

O projeto aborda o desenvolvimento de uma solução completa para download de mídia digital, implementando:

- **Arquitetura Fullstack**: Frontend React integrado com backend FastAPI
- **Comunicação em Tempo Real**: WebSocket para feedback instantâneo de progresso
- **Containerização**: Deploy completo via Docker com suporte IPv6
- **API RESTful**: Endpoints organizados para diferentes tipos de download

## 🚀 Funcionalidades do Sistema

### 🔍 **Pesquisa Inteligente**

- Busca integrada de vídeos utilizando a YouTube API v3
- Interface intuitiva para inserção de URLs diretas
- Visualização de metadados dos vídeos (título, duração, thumbnail)

### 📥 **Download Versátil**

- **Vídeo**: Download em qualidade até 4K (MP4)
- **Áudio**: Conversão automática para MP3 com qualidade otimizada
- **Lote**: Download múltiplo com compactação automática em ZIP
- **Progresso**: Acompanhamento em tempo real via WebSocket

### 🎨 **Interface Moderna**

- Design responsivo com Bootstrap 5
- Experiência mobile-friendly
- Feedback visual para todas as operações
- Tutorial integrado para novos usuários

### ⚡ **Tecnologias de Ponta**

- **Frontend**: React 18, Vite, Bootstrap 5
- **Backend**: FastAPI, pytubefix, MoviePy
- **Comunicação**: WebSocket para notificações instantâneas
- **DevOps**: Docker Compose, hot reload, suporte IPv6

## 🏗️ Arquitetura do Sistema

```
┌─────────────────┐    HTTP/WebSocket    ┌─────────────────┐
│   FRONTEND      │◄──────────────────►│    BACKEND      │
│   React + Vite  │                    │  FastAPI        │
│   Port: 5173    │                    │  Port: 8000     │
└─────────────────┘                    └─────────────────┘
         │                                       │
         │                                       │
         ▼                                       ▼
┌─────────────────┐                    ┌─────────────────┐
│   Browser       │                    │   YouTube API   │
│   Download      │                    │   pytubefix     │
└─────────────────┘                    └─────────────────┘
```

## 💡 Valor e Objetivo

O sistema foi projetado para demonstrar:

1. **Integração de APIs**: Consumo da YouTube API para busca de conteúdo
2. **Processamento de Mídia**: Conversão e otimização de arquivos de vídeo/áudio
3. **Experiência do Usuário**: Interface moderna com feedback em tempo real
4. **Arquitetura Escalável**: Containerização e organização modular do código
5. **Comunicação Bidirecional**: WebSocket para notificações instantâneas

## 👥 Equipe de Desenvolvimento

- **Guilherme S. Sampaio**: Backend, WebSocket, Docker e DevOps
- **Pedro Mota**: Frontend, Interface de Usuário e Testes

---

**Desenvolvido para demonstrar competências em desenvolvimento fullstack, arquitetura de sistemas e implementação de soluções web modernas.**
