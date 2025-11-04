import React from "react";

const URLsSection = ({
  downloadUrls,
  setDownloadUrls,
  downloadType,
  onDownloadFromUrls,
}) => {
  return (
    <>
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
          onClick={onDownloadFromUrls}
          style={{ minWidth: 350 }}
        >
          Baixar {downloadType === "audio" ? "Músicas" : "Vídeos"}
        </button>
      </div>
    </>
  );
};

export default URLsSection;
