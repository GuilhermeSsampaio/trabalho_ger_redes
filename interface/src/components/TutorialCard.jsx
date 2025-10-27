import React from "react";

export default function TutorialCard() {
  return (
    <div className="tutorial-container mb-5">
      <div className="tutorial-title-wrap mt-4">
        <h1 className="tutorial-title">
          Como <span className="tutorial-title-accent">Usar</span>
        </h1>
        <div className="tutorial-subtitle">
          Aprenda a baixar seus vídeos e músicas favoritas do YouTube em poucos segundos
        </div>
      </div>

      <div className="tutorial-card">
        <div className="tutorial-video-area">
          <div className="tutorial-play-button" role="button" aria-label="Assistir tutorial">
            <div className="tutorial-play-triangle" />
          </div>
          <div className="tutorial-click-text">Clique para assistir o tutorial</div>
        </div>

        <div className="tutorial-progress-wrap">
          <div className="tutorial-progress-outer">
            <div className="tutorial-progress-inner" />
          </div>
          <div className="tutorial-time-text">0:35 / 1:47</div>
        </div>

        <div className="tutorial-meta">
          <h3 className="tutorial-video-title">Tutorial Completo - Como Baixar Vídeos do YouTube</h3>
          <div className="tutorial-stats">100.000 visualizações · há 3 dias</div>
        </div>
      </div>

      <div className="steps-wrapper" aria-hidden={false}>
        <div className="steps-grid">
          <div className="step-card" role="group" aria-label="Passo 1">
            <div className="step-badge"><span className="step-number">1</span></div>
            <h4 className="step-title">Cole o Link</h4>
            <p className="step-desc">Copie o link do vídeo do YouTube</p>
          </div>

          <div className="step-card" role="group" aria-label="Passo 2">
            <div className="step-badge"><span className="step-number">2</span></div>
            <h4 className="step-title">Escolha o Formato</h4>
            <p className="step-desc">Selecione áudio ou vídeo</p>
          </div>

          <div className="step-card" role="group" aria-label="Passo 3">
            <div className="step-badge"><span className="step-number">3</span></div>
            <h4 className="step-title">Baixe</h4>
            <p className="step-desc">Clique em baixar e pronto!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
