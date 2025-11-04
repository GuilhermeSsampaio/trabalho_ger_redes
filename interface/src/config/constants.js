// Configurações da aplicação
export const API_CONFIG = {
  BASE_URL: "http://localhost:8000",
  YOUTUBE_API_KEY: import.meta.env.VITE_YOUTUBE_API_KEY,
};

// URLs dos endpoints
export const ENDPOINTS = {
  DOWNLOAD: "/download/",
  HEALTH: "/health",
  YOUTUBE_SEARCH: "https://www.googleapis.com/youtube/v3/search",
};

// Configurações de UI
export const UI_CONFIG = {
  STATUS_TIMEOUT: 5000,
  SEARCH_RESULTS_LIMIT: 20,
  MAX_CONCURRENT_DOWNLOADS: 5,
};

// Mensagens padrão
export const MESSAGES = {
  NO_VIDEOS_SELECTED: "Aqui serão mostrados os vídeos que você deseja baixar!",
  VIDEO_ADDED: "Vídeo adicionado com sucesso!",
  VIDEO_REMOVED: "Vídeo removido com sucesso!",
  VIDEO_ALREADY_ADDED: "Este vídeo já está na lista.",
  DOWNLOAD_STARTED: "Download iniciado com sucesso!",
  DOWNLOAD_COMPLETED: "Download concluído com sucesso!",
  SEARCH_ERROR: "Erro ao realizar a pesquisa. Verifique sua conexão.",
  NO_URLS_PROVIDED: "Selecione pelo menos um vídeo ou insira URLs.",
  NO_VIDEOS_FOR_ZIP: "Nenhum vídeo selecionado para baixar.",
};
