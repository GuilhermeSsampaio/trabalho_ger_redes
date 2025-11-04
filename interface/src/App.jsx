import React from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import TutorialCard from "./components/TutorialCard";
import DownloadSection from "./components/DownloadSection";
import Footer from "./components/Footer";

function App() {
  const handleNavbarSearch = (query) => {
    // Enviar evento personalizado para o DownloadSection
    const event = new CustomEvent("navbarSearch", { detail: query });
    window.dispatchEvent(event);
  };

  return (
    <>
      <Navbar onSearchSubmit={handleNavbarSearch} />
      <Hero />
      <TutorialCard />
      <DownloadSection />
      <Footer />
    </>
  );
}

export default App;
