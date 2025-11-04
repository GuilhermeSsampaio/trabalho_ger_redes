import { useState, useEffect, useRef, useCallback } from "react";
import useAPI from "../../api/useAPI";
import { ENDPOINTS, UI_CONFIG, MESSAGES } from "../config/constants";

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

const useDownloadManager = () => {
  // Importar função do hook useAPI
  const { downloadContent } = useAPI();

  // Estados
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [videoElements, setVideoElements] = useState({});
  const [downloadUrls, setDownloadUrls] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState(null);
  const [activeTab, setActiveTab] = useState("search");
  const [downloadType, setDownloadType] = useState("audio");

  const statusTimeoutRef = useRef(null);

  // Helper para mostrar uma mensagem temporária
  const showStatus = useCallback((msg, duration = UI_CONFIG.STATUS_TIMEOUT) => {
    setDownloadStatus(msg);
    if (statusTimeoutRef.current) clearTimeout(statusTimeoutRef.current);
    statusTimeoutRef.current = setTimeout(() => {
      setDownloadStatus(null);
      statusTimeoutRef.current = null;
    }, duration);
  }, []);

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      if (statusTimeoutRef.current) clearTimeout(statusTimeoutRef.current);
    };
  }, []);

  // === PESQUISA NO YOUTUBE ===
  const handleSearch = useCallback(
    async (q) => {
      const query = q !== undefined ? q : searchQuery;
      if (!query) return;

      try {
        setIsLoading(true);
        const response = await fetch(
          `${ENDPOINTS.YOUTUBE_SEARCH}?part=snippet&q=${encodeURIComponent(
            query
          )}&type=video&key=${YOUTUBE_API_KEY}`
        );
        const data = await response.json();
        setSearchResults(data.items || []);
        // Limpa o campo principal de busca somente quando chamada a partir dele
        if (q === undefined) setSearchQuery("");
      } catch (error) {
        console.error("Error searching videos:", error);
        showStatus(MESSAGES.SEARCH_ERROR, 5000);
      } finally {
        setIsLoading(false);
      }
    },
    [searchQuery, showStatus]
  );

  // Escutar evento de pesquisa da navbar
  useEffect(() => {
    const handleNavbarSearch = (event) => {
      const query = event.detail;
      if (query) {
        setActiveTab("search"); // Mudar para aba de pesquisa
        handleSearch(query);
      }
    };

    window.addEventListener("navbarSearch", handleNavbarSearch);

    return () => {
      window.removeEventListener("navbarSearch", handleNavbarSearch);
    };
  }, [handleSearch]);

  // === ADICIONAR / REMOVER VÍDEOS ===
  const addVideo = (videoId, title) => {
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    if (!selectedVideos.includes(videoUrl)) {
      setSelectedVideos([...selectedVideos, videoUrl]);
      showStatus(MESSAGES.VIDEO_ADDED, 3000);
      setVideoElements((prev) => ({
        ...prev,
        [videoId]: { id: videoId, title },
      }));
    } else {
      showStatus(MESSAGES.VIDEO_ALREADY_ADDED, 3000);
    }
  };

  const removeVideo = (videoId) => {
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    setSelectedVideos(selectedVideos.filter((url) => url !== videoUrl));
    const updatedElements = { ...videoElements };
    delete updatedElements[videoId];
    setVideoElements(updatedElements);
    showStatus(MESSAGES.VIDEO_REMOVED, 3000);
  };

  // === DOWNLOAD VIA BACKEND ===
  const handleDownload = async (urls, outputFormat = "zip") => {
    if (!urls || urls.length === 0) {
      showStatus("Selecione pelo menos um vídeo ou insira URLs.", 5000);
      return;
    }

    setIsLoading(true);
    setDownloadStatus("Iniciando download...");

    try {
      // Determinar formato de saída baseado na quantidade de URLs
      const format =
        urls.length === 1 && outputFormat === "single" ? "single" : "zip";

      const result = await downloadContent(urls, downloadType, format);

      if (result?.error) {
        showStatus(result.message || "Erro no download.", 5000);
      } else {
        showStatus(result?.message || "Download concluído com sucesso!", 5000);
      }

      return result;
    } catch (error) {
      console.error("Erro ao baixar vídeos:", error);
      const errorResult = {
        error: true,
        message: error.message || "Erro desconhecido",
      };
      showStatus(errorResult.message, 5000);
      return errorResult;
    } finally {
      setIsLoading(false);
    }
  };

  const downloadFromUrls = () => {
    const urls = downloadUrls
      .split("\n")
      .map((url) => url.trim())
      .filter((url) => url);
    handleDownload(urls);
  };

  const handleDownloadZip = () => {
    if (selectedVideos.length === 0) {
      showStatus("Nenhum vídeo selecionado para baixar.", 5000);
      return;
    }
    handleDownload(selectedVideos, "zip");
  };

  // Adiciona e inicia download
  const addAndDownload = async (videoId, title) => {
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    addVideo(videoId, title);
    const res = await handleDownload([url], "single");
    if (res && !res.error) {
      showStatus("Download executado com sucesso e finalizado!", 5000);
    }
  };

  return {
    // Estados
    searchQuery,
    setSearchQuery,
    searchResults,
    selectedVideos,
    videoElements,
    downloadUrls,
    setDownloadUrls,
    isLoading,
    downloadStatus,
    activeTab,
    setActiveTab,
    downloadType,
    setDownloadType,

    // Funções
    handleSearch,
    addVideo,
    removeVideo,
    downloadFromUrls,
    handleDownloadZip,
    addAndDownload,
    showStatus,
  };
};

export default useDownloadManager;
