import React, { useRef } from "react";

export default function Navbar({ onSearchSubmit }) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const togglerRef = useRef(null);

  const handleNavLinkClick = (targetId = "download") => {
    const target = document.getElementById(targetId);
    if (
      togglerRef.current &&
      window.getComputedStyle(togglerRef.current).display !== "none"
    ) {
      togglerRef.current.click();
      if (target) {
        setTimeout(() => {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 300);
      }
    } else {
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <nav className="navbar navbar-expand-lg px-3">
      <div className="container-fluid">
        <div className="d-flex align-items-center gap-2">
         <div className="logo-navbar shadow-glow">
          <i className="bi bi-download font-bi-download"></i>
         </div>
         <span className="text-logo-navbar">YT Downloader</span>
        </div>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasNavbar"
          aria-controls="offcanvasNavbar"
          aria-label="Toggle navigation"
          ref={togglerRef}
        >
          <i className="bi bi-list navbar-toggler-icon-custom" aria-hidden="true"></i>
        </button>
        <div
          className="offcanvas offcanvas-end"
          tabIndex="-1"
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
        >
          <div className="offcanvas-header border-bottom">
            <h5 className="offcanvas-title" id="offcanvasNavbarLabel">
              YT Downloader
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div className="offcanvas-body">
            <div className="navbar-nav flex-grow-1 mb-2 mb-lg-0">
              <div className="w-100 d-flex justify-content-center align-items-center gap-3">
                <form
                  className="navbar-search-bar flex-grow-1"
                  role="search"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (onSearchSubmit && searchTerm.trim()) {
                      onSearchSubmit(searchTerm.trim());
                    }
                    handleNavLinkClick("download");
                    setSearchTerm("");
                  }}
                >
                  <input
                    className="navbar-search-input"
                    type="search"
                    placeholder="Pesquisar"
                    aria-label="Pesquisar"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button type="submit" className="navbar-search-button" aria-label="Buscar">
                    <i className="bi bi-search"></i>
                  </button>
                </form>
              </div>
              <button
                className="btn cta-btn"
                onClick={() => {
                  handleNavLinkClick("download");
                }}
              >
                Começar Agora
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
