const useAPI = () => {
  const API_URL = "http://localhost:8000";

  // Faz o download do áudio e retorna o caminho do arquivo
  const downloadMusic = async (videoUrl) => {
    try {
      const response = await fetch(`${API_URL}/download-audio/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: videoUrl }),
      });
      if (!response.ok) throw new Error("Erro ao baixar áudio");
      return await response.json(); // Retorna o caminho do arquivo
    } catch (error) {
      return { error: true, message: error.message };
    }
  };

  // Faz o download de um vídeo completo
  const downloadVideo = async (videoUrl) => {
    try {
      const response = await fetch(`${API_URL}/download-video/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: videoUrl }),
      });
      if (!response.ok) throw new Error("Erro ao baixar vídeo");
      return await response.json(); // Retorna o caminho do arquivo
    } catch (error) {
      return { error: true, message: error.message };
    }
  };

  // Faz o download de múltiplos vídeos e retorna o ZIP
  const downloadVideos = async (videoUrls) => {
    try {
      const response = await fetch(`${API_URL}/download-multiple-audio/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls: videoUrls }),
      });
      if (!response.ok) throw new Error("Erro ao baixar vídeos");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "musicas.zip"; // Nome do arquivo ZIP
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao baixar vídeos:", error);
    }
  };

  // Faz o download de múltiplos vídeos como um arquivo ZIP
  const downloadVideosZip = async (videoUrls) => {
    try {
      const response = await fetch(`${API_URL}/download-multiple-videos/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls: videoUrls }),
      });
      if (!response.ok) throw new Error("Erro ao baixar vídeos em ZIP");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "videos.zip"; // Nome do arquivo ZIP
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao baixar vídeos em ZIP:", error);
    }
  };

  // Faz o download do arquivo ZIP gerado
  const downloadZip = async () => {
    try {
      const response = await fetch(`${API_URL}/download-zip/`);
      if (!response.ok) throw new Error("Erro ao baixar arquivo ZIP");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "musicas.zip"; // Nome do arquivo ZIP
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao baixar arquivo ZIP:", error);
    }
  };

  return {
    downloadMusic,
    downloadVideo,
    downloadVideos,
    downloadVideosZip,
    downloadZip,
  };
};

export default useAPI;
