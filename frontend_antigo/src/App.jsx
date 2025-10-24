import React, { useState, useEffect } from "react";
import "./styles.css";

// YouTubeAPI pode ser opcional agora, pois você pode usar só as URLs
// fazer as requisições pra api fastapi
const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY; // Substitua pela sua chave

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
  const [downloadType, setDownloadType] = useState("audio"); // Novo estado para tipo de download

  useEffect(() => {
    // Configurar listener para atualizações de progresso
    const removeListener = window.api.onDownloadProgress((data) => {
      if (data.status === "started") {
        setIsLoading(true);
      } else if (data.status === "finished") {
        setIsLoading(false);
      }

      setDownloadStatus(data.message);
    });

    // Limpar listener quando o componente desmontar
    return () => {
      removeListener();
    };
  }, []);

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
      alert("Erro ao realizar a pesquisa. Verifique a conexão.");
    } finally {
      setIsLoading(false);
    }
  };

  const addVideo = (videoId, title) => {
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

    if (!selectedVideos.includes(videoUrl)) {
      setSelectedVideos([...selectedVideos, videoUrl]);
      setMessage("Vídeo adicionado com sucesso!");

      // Adicionar à referência de elementos
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
    const updatedVideos = selectedVideos.filter((url) => url !== videoUrl);

    setSelectedVideos(updatedVideos);

    // Remover da referência de elementos
    const updatedElements = { ...videoElements };
    delete updatedElements[videoId];
    setVideoElements(updatedElements);

    setMessage("Vídeo removido com sucesso!");
  };

  const downloadVideos = async (urls) => {
    setIsLoading(true);
    setDownloadStatus("Iniciando download...");

    try {
      // Chamando a API do Electron para iniciar o download
      const result = await window.api.downloadVideos({
        urls,
        type: downloadType,
      }); // Passar o tipo de download

      if (result.error) {
        alert(`Erro: ${result.message}`);
      } else {
        setDownloadStatus(result.message);
      }
    } catch (error) {
      console.error("Error downloading videos:", error);
      alert("Ocorreu um erro ao baixar os vídeos.");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadAll = () => {
    if (selectedVideos.length > 0) {
      downloadVideos(selectedVideos);
    } else {
      alert("Selecione pelo menos um vídeo para baixar.");
    }
  };

  const downloadFromUrls = () => {
    const urls = downloadUrls
      .split("\n")
      .map((url) => url.trim())
      .filter((url) => url);

    if (urls.length > 0) {
      downloadVideos(urls);
    } else {
      alert("Por favor, insira pelo menos uma URL.");
    }
  };

  return (
    <div className="container container-fluid mt-5 center">
      <h1>Baixar músicas ou vídeos do YouTube</h1>

      <div className="mb-3">
        <select
          className="form-select mb-3"
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value)}
        >
          <option value="search">Pesquisar e Baixar</option>
          <option value="urls">Baixar pelas URLs</option>
        </select>
      </div>

      <div className="mb-3">
        <label>Escolha o tipo de download:</label>
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
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Pesquise por músicas"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button className="btn btn-primary" onClick={handleSearch}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                fill="currentColor"
                className="bi bi-search"
                viewBox="0 0 16 16"
              >
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
              </svg>
            </button>
          </div>

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

          <h2 id="msg" className="mt-3">
            {message}
          </h2>

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
            <button
              id="downloadAll"
              className="btn btn-primary mt-3"
              onClick={downloadAll}
            >
              Baixar Todos
            </button>
          )}
        </>
      ) : (
        <>
          <h1>Inserir uma lista de urls para baixar:</h1>
          <textarea
            className="form-control mb-3"
            rows="10"
            placeholder="Insira as URLs dos vídeos, uma por linha"
            value={downloadUrls}
            onChange={(e) => setDownloadUrls(e.target.value)}
          ></textarea>
          <button className="btn btn-primary mt-3" onClick={downloadFromUrls}>
            Baixar Músicas
          </button>
        </>
      )}

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
  );
}

export default App;
