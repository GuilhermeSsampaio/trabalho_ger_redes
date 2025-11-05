import React from "react";

export default function Footer() {
  return (
    <footer className="yt-footer mt-5">
      <div className="yt-footer__inner">
        <div className="yt-footer__cols">
          <div className="col-footer col--brand">
            <div className="brand">
              <div className="logo-navbar" aria-hidden>
                <i className="bi bi-download" style={{ fontSize: "24px" }}></i>
              </div>
              <div className="brand__text">
                <span className="brand__title">YT Downloader</span>
              </div>
            </div>
            <p className="brand__desc">
              A maneira mais rápida e fácil de baixar vídeos e músicas do
              YouTube em alta qualidade.
            </p>
          </div>
          <div className="col">
            <h4 className="col__title">Links Rápidos</h4>
            <ul className="col__list">
              <li>Início</li>
              <li>Como Usar</li>
              <li>Download</li>
              <li>FAQ</li>
            </ul>
          </div>
          <div className="col">
            <h4 className="col__title">Suporte</h4>
            <ul className="col__list">
              <li>Central de Ajuda</li>
              <li>Política de Privacidade</li>
              <li>Termos de Uso</li>
              <li>Contato</li>
            </ul>
          </div>
          <div className="col">
            <h4 className="col__title">Informações</h4>
            <ul className="col__list col__list--info">
              <li>
                <span className="icon-youtube" aria-hidden>
                  ▶︎
                </span>{" "}
                Compatível com YouTube
              </li>
              <li>✓ Download em HD e 4K</li>
              <li>✓ Conversão para MP3</li>
              <li>✓ 100% Gratuito</li>
            </ul>
          </div>
        </div>
        <hr className="yt-footer__divider" />
        <div className="yt-footer__bottom">
          <div className="bottom__left">
            © 2024 YT Downloader. Todos os direitos reservados.
          </div>
          <div className="bottom__right">
            Feito com <span className="heart">❤</span> para a comunidade
          </div>
        </div>
      </div>
    </footer>
  );
}
