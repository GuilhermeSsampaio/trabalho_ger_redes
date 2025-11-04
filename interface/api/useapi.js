const useAPI = () => {
  const API_URL = "http://localhost:8000";

  console.log("useAPI function called"); // Debug log

  /**
   * Função unificada para download usando a nova API
   * @param {string|string[]} urls - URL única ou array de URLs
   * @param {string} downloadType - "audio" ou "video"
   * @param {string} outputFormat - "single" ou "zip"
   * @returns {Promise} - Resposta da API ou erro
   */
  const downloadContent = async (
    urls,
    downloadType = "audio",
    outputFormat = "single"
  ) => {
    console.log("downloadContent called with:", {
      urls,
      downloadType,
      outputFormat,
    }); // Debug log
    try {
      // Normalizar entrada para array
      const urlArray = Array.isArray(urls) ? urls : [urls];

      const response = await fetch(`${API_URL}/download/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          urls: urlArray,
          download_type: downloadType,
          output_format: outputFormat,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail || `Erro ${response.status}: ${response.statusText}`
        );
      }

      // Se for um arquivo único, retorna JSON com informações
      if (outputFormat === "single") {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          return await response.json();
        }
        // Se for um arquivo direto, baixa automaticamente
        return await handleFileDownload(response, downloadType);
      }

      // Se for ZIP, sempre baixa automaticamente
      return await handleFileDownload(response, downloadType, true);
    } catch (error) {
      console.error("Erro no download:", error);
      return {
        error: true,
        message: error.message || "Erro desconhecido no download",
      };
    }
  };

  /**
   * Helper para lidar com download de arquivos
   */
  const handleFileDownload = async (response, downloadType, isZip = false) => {
    try {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;

      // Determinar nome do arquivo
      if (isZip) {
        a.download = downloadType === "audio" ? "musicas.zip" : "videos.zip";
      } else {
        // Tentar extrair nome do cabeçalho Content-Disposition
        const disposition = response.headers.get("Content-Disposition");
        if (disposition && disposition.includes("filename=")) {
          a.download = disposition.split("filename=")[1].replace(/"/g, "");
        } else {
          const extension = downloadType === "audio" ? "mp3" : "mp4";
          a.download = `download.${extension}`;
        }
      }

      a.click();
      window.URL.revokeObjectURL(url);

      return {
        success: true,
        message: isZip
          ? "ZIP baixado com sucesso!"
          : "Arquivo baixado com sucesso!",
      };
    } catch {
      throw new Error("Erro ao processar o download do arquivo");
    }
  };

  // Funções específicas usando a API unificada
  const downloadSingleAudio = (url) => downloadContent(url, "audio", "single");
  const downloadSingleVideo = (url) => downloadContent(url, "video", "single");
  const downloadMultipleAudio = (urls) => downloadContent(urls, "audio", "zip");
  const downloadMultipleVideos = (urls) =>
    downloadContent(urls, "video", "zip");

  // Funções de compatibilidade (simplificadas)
  const downloadMusic = downloadSingleAudio;
  const downloadVideo = downloadSingleVideo;
  const downloadVideos = downloadMultipleAudio;
  const downloadVideosZip = downloadMultipleVideos;

  const apiObject = {
    // Nova API unificada
    downloadContent,
    downloadSingleAudio,
    downloadSingleVideo,
    downloadMultipleAudio,
    downloadMultipleVideos,

    // Compatibilidade com código existente
    downloadMusic,
    downloadVideo,
    downloadVideos,
    downloadVideosZip,
  };

  console.log("useAPI returning object:", apiObject); // Debug log
  console.log("downloadContent type:", typeof downloadContent); // Debug log

  return apiObject;
};

export default useAPI;
