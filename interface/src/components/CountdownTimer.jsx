import React from "react";

const CountdownTimer = ({ seconds, isActive }) => {
  if (!isActive || seconds <= 0) return null;

  return (
    <div className="countdown-timer">
      <div className="countdown-content">
        <i className="bi bi-clock-history countdown-icon"></i>
        <div className="countdown-info">
          <span className="countdown-label">Arquivo será removido em</span>
          <span className="countdown-value">{seconds}s</span>
        </div>
      </div>
      <div className="countdown-bar-wrapper">
        <div
          className="countdown-bar-fill"
          style={{ width: `${(seconds / 30) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default CountdownTimer;
