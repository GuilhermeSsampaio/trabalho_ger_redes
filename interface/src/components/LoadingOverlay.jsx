import React from "react";

const LoadingOverlay = ({ isLoading, downloadStatus }) => {
  if (!isLoading) return null;

  return (
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
  );
};

export default LoadingOverlay;
