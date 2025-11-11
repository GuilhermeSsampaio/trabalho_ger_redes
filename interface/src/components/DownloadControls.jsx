import React from "react";

const DownloadControls = ({
  activeTab,
  setActiveTab,
  downloadType,
  setDownloadType,
}) => {
  return (
    <>
      <div className="mb-4">
        <label className="mb-1">
          Escolha entre pesquisar ou buscar por URLs:
        </label>
        <select
          className="form-select white-arrow"
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
          className="form-select white-arrow"
          value={downloadType}
          onChange={(e) => setDownloadType(e.target.value)}
        >
          <option value="audio">Somente Áudio</option>
          <option value="video">Vídeo Completo</option>
        </select>
      </div>
    </>
  );
};

export default DownloadControls;
