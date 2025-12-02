import React from "react";
import DownloadControls from "./DownloadControls";
import SearchSection from "./SearchSection";
import URLsSection from "./URLsSection";
import VideoList from "./VideoList";
import LoadingOverlay from "./LoadingOverlay";
import StatusAlert from "./StatusAlert";
import CountdownTimer from "./CountdownTimer";
import useDownloadManager from "../hooks/useDownloadManager";

const DownloadSection = () => {
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    selectedVideos,
    videoElements,
    downloadUrls,
    setDownloadUrls,
    isLoading,
    downloadStatus,
    progress,
    currentDownload,
    totalDownloads,
    activeTab,
    setActiveTab,
    downloadType,
    setDownloadType,
    handleSearch,
    addVideo,
    removeVideo,
    downloadFromUrls,
    handleDownloadZip,
    addAndDownload,
    countdown,
    isCountingDown,
  } = useDownloadManager();

  return (
    <>
      <div id="download" className="tutorial-title-wrap">
        <h1 className="tutorial-title">
          Baixar músicas ou vídeos do{" "}
          <span className="tutorial-title-accent">YouTube</span>
        </h1>
        <div className="tutorial-subtitle">
          Cole o link do vídeo e escolha o formato desejado
        </div>
      </div>

      <div className="container container-fluid mt-5 mb-5 center">
        <div className="card-download">
          <DownloadControls
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            downloadType={downloadType}
            setDownloadType={setDownloadType}
          />

          {activeTab === "search" ? (
            <>
              <SearchSection
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onSearch={handleSearch}
                searchResults={searchResults}
                onAddVideo={addVideo}
                onAddAndDownload={addAndDownload}
                isLoading={isLoading}
              />

              <VideoList
                videoElements={videoElements}
                removeVideo={removeVideo}
                selectedVideos={selectedVideos}
                downloadType={downloadType}
                onDownloadZip={handleDownloadZip}
              />
            </>
          ) : (
            <URLsSection
              downloadUrls={downloadUrls}
              setDownloadUrls={setDownloadUrls}
              downloadType={downloadType}
              onDownloadFromUrls={downloadFromUrls}
            />
          )}

          <LoadingOverlay
            isLoading={isLoading}
            downloadStatus={downloadStatus}
            progress={progress}
            currentItem={currentDownload}
            totalItems={totalDownloads}
          />
          
          {!isLoading && (
            <CountdownTimer seconds={countdown} isActive={isCountingDown} />
          )}
          
          {!isLoading && (
            <StatusAlert isLoading={isLoading} downloadStatus={downloadStatus} />
          )}
        </div>
      </div>
    </>
  );
};

export default DownloadSection;
