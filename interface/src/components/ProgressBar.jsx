import React from "react";

const ProgressBar = ({ progress = 0, message = "" }) => {
  // Extrair porcentagem da mensagem se não tiver valor numérico
  let percentage = progress;

  if (typeof message === "string" && message.includes("%")) {
    const match = message.match(/(\d+)%/);
    if (match) {
      percentage = parseInt(match[1]);
    }
  }

  return (
    <div className="progress-container">
      <div className="progress-info">
        <span className="progress-message">{message || "Processando..."}</span>
        <span className="progress-percentage">{percentage}%</span>
      </div>
      <div className="progress-bar-wrapper">
        <div
          className="progress-bar-fill"
          style={{
            width: `${percentage}%`,
            transition: percentage > 0 ? "width 0.3s ease" : "none",
          }}
        >
          <div className="progress-bar-animated"></div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
