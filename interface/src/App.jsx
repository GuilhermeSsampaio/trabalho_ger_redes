import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import TutorialCard from "./components/TutorialCard";
import Footer from "./components/Footer";
import useAPI from "../api/useapi";

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [videoElements, setVideoElements] = useState({});
  const [downloadUrls, setDownloadUrls] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState(null);
  const [activeTab, setActiveTab] = useState("search");
  const [message, setMessage] = useState(
    "Aqui serão mostrados os vídeos que você deseja baixar!"
  );
  const [downloadType, setDownloadType] = useState("audio");

  const { downloadVideos, downloadVideo, downloadMusic, downloadVideosZip } =
    useAPI();

  const statusTimeoutRef = useRef(null);

  // helper para mostrar uma mensagem temporária
  const showStatus = (msg, duration = 5000) => {
    setDownloadStatus(msg);
    if (statusTimeoutRef.current) clearTimeout(statusTimeoutRef.current);
    statusTimeoutRef.current = setTimeout(() => {
      setDownloadStatus(null);
      statusTimeoutRef.current = null;
    }, duration);
  };

  useEffect(() => {
    return () => {
      if (statusTimeoutRef.current) clearTimeout(statusTimeoutRef.current);
    };
  }, []);

  // === PESQUISA NO YOUTUBE ===
  const handleSearch = async (q) => {
    const query = q !== undefined ? q : searchQuery;
    if (!query) return;
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
          query
        )}&type=video&key=${YOUTUBE_API_KEY}`
      );
      const data = await response.json();
      setSearchResults(data.items || []);
      // limpa o campo principal de busca somente quando chamada a partir dele
      if (q === undefined) setSearchQuery("");
    } catch (error) {
      console.error("Error searching videos:", error);
      alert("Erro ao realizar a pesquisa. Verifique sua conexão.");
    } finally {
      setIsLoading(false);
    }
  };

  // === ADICIONAR / REMOVER VÍDEOS ===
  const addVideo = (videoId, title) => {
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    if (!selectedVideos.includes(videoUrl)) {
      setSelectedVideos([...selectedVideos, videoUrl]);
      setMessage("Vídeo adicionado com sucesso!");
      setVideoElements((prev) => ({
        ...prev,
        [videoId]: { id: videoId, title },
      }));
    } else {
      alert("Este vídeo já está na lista.");
    }
  };

  const removeVideo = (videoId) => {
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    setSelectedVideos(selectedVideos.filter((url) => url !== videoUrl));
    const updatedElements = { ...videoElements };
    delete updatedElements[videoId];
    setVideoElements(updatedElements);
    setMessage("Vídeo removido com sucesso!");
  };

  // === DOWNLOAD VIA BACKEND ===
  const handleDownload = async (urls) => {
    if (!urls || urls.length === 0) {
      alert("Selecione pelo menos um vídeo ou insira URLs.");
      return;
    }
    setIsLoading(true);
    setDownloadStatus("Iniciando download...");
    let result = null;
    try {
      if (urls.length === 1) {
        const url = urls[0];
        result =
          downloadType === "audio"
            ? await downloadMusic(url)
            : await downloadVideo(url);
      } else {
        result = await downloadVideos(urls);
      }

      if (result?.error) {
        alert(`Erro: ${result.message}`);
        showStatus(result.message || "Erro no download.", 5000);
      } else {
        // mostra mensagem final por alguns segundos
        showStatus(result?.message || "Download iniciado com sucesso!", 5000);

        // Se vier um caminho ZIP, abre o link automaticamente
        if (result?.zip_path) {
          window.open(result.zip_path, "_blank");
        }
      }
    } catch (error) {
      console.error("Erro ao baixar vídeos:", error);
      alert("Ocorreu um erro ao processar o download.");
      result = { error: true, message: error.message || "Erro desconhecido" };
      showStatus(result.message, 5000);
    } finally {
      setIsLoading(false);
    }
    return result;
  };

  // const downloadAll = () => handleDownload(selectedVideos);

  const downloadFromUrls = () => {
    const urls = downloadUrls
      .split("\n")
      .map((url) => url.trim())
      .filter((url) => url);
    handleDownload(urls);
  };

  const handleDownloadZip = async () => {
    if (selectedVideos.length === 0) {
      alert("Nenhum vídeo selecionado para baixar.");
      return;
    }
    try {
      setIsLoading(true);
      setDownloadStatus("Criando arquivo ZIP...");
      const response = await fetch(
        "http://localhost:8000/download-multiple-audio/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ urls: selectedVideos }),
        }
      );
      if (!response.ok) {
        throw new Error("Erro ao criar o arquivo ZIP.");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "musicas.zip";
      a.click();
      window.URL.revokeObjectURL(url);
      // usar showStatus para sumir depois de alguns segundos
      showStatus("Arquivo ZIP baixado com sucesso!", 5000);
    } catch (error) {
      console.error("Erro ao baixar ZIP:", error);
      alert("Erro ao baixar o arquivo ZIP.");
      showStatus("Erro ao baixar o arquivo ZIP.", 5000);
    } finally {
      setIsLoading(false);
    }
  };

  // utilitário simples para converter duração ISO (se vier) para algo legível
  const formatDuration = (iso) => {
    if (!iso) return "";
    try {
      // transforma PT#H#M#S em H:MM:SS ou M:SS (simples)
      const parts = iso.replace("PT", "").match(/(\d+H)?(\d+M)?(\d+S)?/);
      if (!parts) return "";
      const h = parts[1] ? parts[1].replace("H", "") : null;
      const m = parts[2] ? parts[2].replace("M", "") : null;
      const s = parts[3] ? parts[3].replace("S", "") : null;
      const nums = [h, m, s].filter(Boolean).map(Number);
      if (nums.length === 0) return "";
      if (nums.length === 1) return `${nums[0]}`;
      if (nums.length === 2)
        return `${nums[0]}:${String(nums[1]).padStart(2, "0")}`;
      return `${nums[0]}:${String(nums[1]).padStart(2, "0")}:${String(nums[2]).padStart(
        2,
        "0"
      )}`;
    } catch {
      return "";
    }
  };

  // nova função: adiciona e inicia download, atualiza mensagem quando finalizado
  const addAndDownload = async (videoId, title) => {
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    addVideo(videoId, title);
    const res = await handleDownload([url]);
    if (res && !res.error) {
      showStatus("Download executado com sucesso e finalizado!", 5000);
    }
  };

  return (
    <>
      <Navbar onSearchSubmit={(q) => handleSearch(q)} />
      <Hero />
      <TutorialCard />
      <div id="download" className="tutorial-title-wrap">
        <h1 className="tutorial-title">
          Baixar músicas ou vídeos do{" "}
          <span className="tutorial-title-accent">YouTube</span>
        </h1>
        <div className="tutorial-subtitle">
          Cole o link do vídeo e escolha o formato desejado
        </div>
      </div>
      <div className="container container-fluid mt-5 mb-5 center">
        <div className="card-download">
          <div className="mb-4">
            <label className="mb-1">
              Escolha entre pesquisar ou buscar por URLs:
            </label>
            <select
              className="form-select"
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
            >
              <option value="search">Pesquisar e Baixar</option>
              <option value="urls">Baixar pelas URLs</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="mb-1">Escolha o tipo de download:</label>
            <select
              className="form-select"
              value={downloadType}
              onChange={(e) => setDownloadType(e.target.value)}
            >
              <option value="audio">Somente Áudio</option>
              <option value="video">Vídeo Completo</option>
            </select>
          </div>
          {activeTab === "search" ? (
            <>
              <div className="input-group mb-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Pesquise por músicas"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <button
                  className="btn btn-primary"
                  onClick={handleSearch}
                  style={{ border: "none", height: "50px" }}
                >
                  <i className="bi bi-search" />
                </button>
              </div>
              <div className="container mb-5">
                <div className="row row-cols-1 row-cols-md-3 g-4">
                  {searchResults.map((item) => {
                    const videoId = item.id?.videoId || item.id;
                    const thumb =
                      item.snippet?.thumbnails?.high?.url ||
                      item.snippet?.thumbnails?.default?.url;
                    const duration = item.contentDetails?.duration
                      ? formatDuration(item.contentDetails.duration)
                      : "";
                    return (
                      <div key={videoId} className="col-music">
                        <div className="yt-col">
                          <div className="yt-card w-100">
                            <div className="yt-thumb-wrap">
                              <img
                                src={thumb}
                                alt={item.snippet?.title}
                                className="yt-thumb"
                              />
                              {duration && (
                                <div className="duration-badge">{duration}</div>
                              )}
                            </div>
                            <div
                              className="card-title-yt"
                              title={item.snippet?.title}
                            >
                              {item.snippet?.title}
                            </div>
                            <div className="channel-row">
                              <span>{item.snippet?.channelTitle}</span>
                              <span>•</span>
                              <span>
                                {Math.floor(Math.random() * 10) + 1}M
                              </span>
                            </div>
                            <div className="card-actions mt-5">
                              <button
                                className="add-btn"
                                onClick={() => addVideo(videoId, item.snippet?.title)}
                              >
                                + Adicionar
                              </button>
                              <button
                                className="icon-btn"
                                title="Adicionar e baixar"
                                onClick={() => addAndDownload(videoId, item.snippet?.title)}
                              >
                                <i className="bi bi-download" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* Lista de vídeos selecionados */}
              <div className="empty-state text-center mt-2 mb-4">
                <div
                  style={{
                    width: 96,
                    height: 96,
                    margin: "0 auto",
                    borderRadius: "50%",
                    background: "#2b2b2b",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <i className="bi bi-download" style={{fontSize: "36px"}}></i>
                </div>
                <h2
                  id="msg"
                  className="mt-3"
                  style={{ color: "#fff", fontSize: 18 }}
                >
                  {message}
                </h2>
              </div>
              <ul className="list-group mb-3">
                {Object.values(videoElements).map((video) => (
                  <li
                    key={video.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    {video.title}
                    <button
                      className="btn btn-danger"
                      onClick={() => removeVideo(video.id)}
                    >
                      Remover
                    </button>
                  </li>
                ))}
              </ul>
              {selectedVideos.length > 0 && (
                <div className="hero-ctas downloads-row">
                  <button
                    className="button-download btn-primary"
                    onClick={handleDownloadZip}
                  >
                    Baixar Todos os {downloadType === "audio" ? "Áudios" : "Vídeos"}
                  </button>
                  {downloadType === "audio" ? (
                    <button
                      className="button-download btn-secondary"
                      onClick={handleDownloadZip}
                    >
                      Baixar ZIP com Músicas
                    </button>
                  ) : (
                    <button
                      className="button-download btn-secondary"
                      onClick={() => downloadVideosZip(selectedVideos)}
                    >
                      Baixar ZIP com Vídeos
                    </button>
                  )}
                </div>
              )}
            </>
          ) : (
            <>
              {/* Modo de URLs */}
              <h5>Inserir uma lista de URLs para baixar:</h5>
              <textarea
                className="form-control mb-3"
                rows="10"
                placeholder="Insira as URLs dos vídeos, uma por linha"
                value={downloadUrls}
                onChange={(e) => setDownloadUrls(e.target.value)}
              ></textarea>
              <div className="hero-ctas">
                <button
                  className="button-download btn-primary mt-3 justify-content-center"
                  onClick={downloadFromUrls}
                  style={{ minWidth: 350 }}
                >
                  Baixar {downloadType === "audio" ? "Músicas" : "Vídeos"}
                </button>
              </div>
            </>
          )}
          {/* Status do download */}
          {isLoading && (
            <div className="modal-overlay">
              <div className="loading-modal">
                <div className="lds-roller">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
                <p className="mt-3 loading-text">
                  {downloadStatus || "Processando..."}
                </p>
              </div>
            </div>
          )}
          {!isLoading && downloadStatus && (
            <div className="alert alert-success mt-3">{downloadStatus}</div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default App;
