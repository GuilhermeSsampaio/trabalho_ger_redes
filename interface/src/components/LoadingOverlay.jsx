import React from "react";
import ProgressBar from "./ProgressBar";

const LoadingOverlay = ({
  isLoading,
  downloadStatus,
  progress = 0,
  currentItem = 0,
  totalItems = 0,
}) => {
  if (!isLoading) return null;

  // Verificar se há progresso real sendo exibido
  const hasProgress = downloadStatus && downloadStatus.includes("%");

  // Extrair contador da mensagem se houver (ex: "Processando 1/2")
  const counterMatch = downloadStatus?.match(/(\d+)\/(\d+)/);
  const current = counterMatch ? parseInt(counterMatch[1]) : currentItem;
  const total = counterMatch ? parseInt(counterMatch[2]) : totalItems;

  return (
    <div className="modal-overlay">
      <div className="loading-modal">
        {!hasProgress && (
          <>
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

            {total > 0 && (
              <div className="download-counter">
                <span className="counter-text">
                  {current}/{total}
                </span>
                <span className="counter-label">
                  {current === total ? "Finalizando..." : "Baixando"}
                </span>
              </div>
            )}
          </>
        )}

        {hasProgress ? (
          <ProgressBar progress={progress} message={downloadStatus} />
        ) : (
          <p className="mt-3 loading-text">
            {downloadStatus || "Processando..."}
          </p>
        )}
      </div>
    </div>
  );
};

export default LoadingOverlay;
