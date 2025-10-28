const useAPI = () => {
  // Por padrão, FastAPI roda na porta 8000
  // const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
  const API_URL = "http://localhost:8000";

  // Busca vídeos no YouTube (usando a API do YouTube, não backend)
  // Mantido para interface, mas não implementado aqui
  const searchVideos = async (query) => {
    // Implementação opcional, pois a busca é feita direto no App.jsx
    return [];
  };

  // Faz download de múltiplos vídeos/áudios
  const downloadVideos = async (videoUrls, downloadType = "audio") => {
    try {
      const response = await fetch(`${API_URL}/download_from_urls/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ urls: videoUrls, download_type: downloadType }),
      });
      if (!response.ok) {
        throw new Error("Erro ao requisitar download");
      }
      return await response.json();
    } catch (error) {
      return { error: true, message: error.message };
    }
  };

  // Download de vídeo individual (vídeo)
  const downloadVideo = async (videoUrl) => {
    try {
      const response = await fetch(`${API_URL}/download_video/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ video_url: videoUrl }),
      });
      if (!response.ok) throw new Error("Erro ao baixar vídeo");
      return await response.json();
    } catch (error) {
      return { error: true, message: error.message };
    }
  };

  // Download de vídeo individual (áudio)
  const downloadMusic = async (videoUrl) => {
    try {
      const response = await fetch(`${API_URL}/download_music/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ video_url: videoUrl }),
      });
      if (!response.ok) throw new Error("Erro ao baixar áudio");
      return await response.json();
    } catch (error) {
      return { error: true, message: error.message };
    }
  };

  // Download de playlist (lista de URLs)
  const downloadPlaylist = async (playlistUrls) => {
    try {
      const response = await fetch(`${API_URL}/download_playlist/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playlist_urls: playlistUrls }),
      });
      if (!response.ok) throw new Error("Erro ao baixar playlist");
      // Se for um arquivo, pode ser necessário tratar blob
      return await response.json();
    } catch (error) {
      return { error: true, message: error.message };
    }
  };

  return {
    searchVideos,
    downloadVideos,
    downloadVideo,
    downloadMusic,
    downloadPlaylist,
  };
};

export default useAPI;
