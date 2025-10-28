import React, { useState } from "react";
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

  // === PESQUISA NO YOUTUBE ===
  const handleSearch = async () => {
    if (!searchQuery) return;
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchQuery}&type=video&key=${YOUTUBE_API_KEY}`
      );
      const data = await response.json();
      setSearchResults(data.items || []);
      setSearchQuery("");
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

    try {
      let result;
      if (urls.length === 1) {
        const url = urls[0];
        result =
          downloadType === "audio"
            ? await downloadMusic(url)
            : await downloadVideo(url);
      } else {
        result = await downloadVideos(urls);
      }

      if (result.error) {
        alert(`Erro: ${result.message}`);
      } else {
        setDownloadStatus(result.message || "Download iniciado com sucesso!");

        // Se vier um caminho ZIP, abre o link automaticamente
        if (result.zip_path) {
          window.open(result.zip_path, "_blank");
        }
      }
    } catch (error) {
      console.error("Erro ao baixar vídeos:", error);
      alert("Ocorreu um erro ao processar o download.");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadAll = () => handleDownload(selectedVideos);

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
      setDownloadStatus("Arquivo ZIP baixado com sucesso!");
    } catch (error) {
      console.error("Erro ao baixar ZIP:", error);
      alert("Erro ao baixar o arquivo ZIP.");
    } finally {
      setIsLoading(false);
    }
  };

  // === INTERFACE ===
  return (
    <>
      <Navbar />
      <Hero />
      <TutorialCard />

      <div className="tutorial-title-wrap">
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
          {/* Seleção de modo e tipo */}
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
              {/* Campo de busca */}
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

              {/* Resultados da busca */}
              <div className="container">
                <div className="row row-cols-1 row-cols-md-3 g-4">
                  {searchResults.map((item) => (
                    <div key={item.id.videoId} className="col">
                      <div className="card-body bg-light p-1">
                        <img
                          src={item.snippet.thumbnails.default.url}
                          alt={item.snippet.title}
                          className="card-img-top"
                        />
                        <p className="card-title">{item.snippet.title}</p>
                        <button
                          className="btn btn-primary"
                          onClick={() =>
                            addVideo(item.id.videoId, item.snippet.title)
                          }
                        >
                          Adicionar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lista de vídeos selecionados */}
              <div className="empty-state text-center mt-3 mb-4">
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
                <>
                  <button
                    className="btn btn-primary mt-3"
                    onClick={downloadAll}
                  >
                    Baixar Todos
                  </button>
                  {downloadType === "audio" ? (
                    <button
                      className="btn btn-secondary mt-3 ms-3"
                      onClick={handleDownloadZip}
                    >
                      Baixar ZIP com Músicas
                    </button>
                  ) : (
                    <button
                      className="btn btn-secondary mt-3 ms-3"
                      onClick={() => downloadVideosZip(selectedVideos)}
                    >
                      Baixar ZIP com Vídeos
                    </button>
                  )}
                </>
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
              <div className="d-flex justify-content-center">
                <button
                  className="btn btn-primary btn-sm mt-3"
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
