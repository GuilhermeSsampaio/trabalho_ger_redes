import React from 'react';

const Hero = () => {
  return (
    <section className="hero">
      <div className="blur-3xl animate-pulse" style={{position: "absolute", borderRadius: "9999px", width: "18rem", height: "18rem", top: "5rem", left: "2.5rem", backgroundColor: "hsl(0 100% 50% / .1)"}}></div>
      <div className="blur-3xl animate-pulse" style={{position: "absolute", borderRadius: "9999px", width: "24rem", height: "24rem", bottom: "5rem", right: "2.5rem", backgroundColor: "hsl(0 100% 50% / .1)"}}></div>
      <div className="hero-inner">
        <div className="hero-badge"><i className="bi bi-stars" style={{color: "#ff0000"}}></i> Rápido, Gratuito e Seguro</div>

        <h1 className="hero-title">
          Baixe Vídeos do <span className="yt animate-pulse">YouTube</span><br />
          em Segundos
        </h1>

        <p className="hero-sub">
          Converta e baixe seus vídeos e músicas favoritas em MP3 ou MP4 com a melhor qualidade disponível
        </p>

        <div className="hero-ctas">
          <button
            className="button btn-primary"
            aria-label="Começar a baixar - ir para seção de download"
            onClick={() => {
              const target = document.getElementById('download');
              if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
          >
            <span className="icon"><i className="bi bi-download font-bi-download"></i></span> Começar a Baixar
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
