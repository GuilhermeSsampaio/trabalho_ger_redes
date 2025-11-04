import React from "react";
import { MESSAGES } from "../config/constants";

const VideoList = ({
  videoElements,
  removeVideo,
  selectedVideos,
  downloadType,
  onDownloadZip,
}) => {
  return (
    <>
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
          <i className="bi bi-download" style={{ fontSize: "36px" }}></i>
        </div>
        <h2 id="msg" className="mt-3" style={{ color: "#fff", fontSize: 18 }}>
          {MESSAGES.NO_VIDEOS_SELECTED}
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
            onClick={onDownloadZip}
          >
            Baixar {selectedVideos.length > 1 ? "Todos os" : ""}{" "}
            {downloadType === "audio" ? "Áudios" : "Vídeos"}
            {selectedVideos.length > 1 ? " (ZIP)" : ""}
          </button>
        </div>
      )}
    </>
  );
};

export default VideoList;
