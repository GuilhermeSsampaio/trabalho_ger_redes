import React from "react";

const SearchSection = ({
  searchQuery,
  setSearchQuery,
  onSearch,
  searchResults,
  onAddVideo,
  onAddAndDownload,
  isLoading,
}) => {
  // Utilitário para formatar duração ISO
  const formatDuration = (iso) => {
    if (!iso) return "";
    try {
      const parts = iso.replace("PT", "").match(/(\d+H)?(\d+M)?(\d+S)?/);
      if (!parts) return "";
      const h = parts[1] ? parts[1].replace("H", "") : null;
      const m = parts[2] ? parts[2].replace("M", "") : null;
      const s = parts[3] ? parts[3].replace("S", "") : null;
      const nums = [h, m, s].filter(Boolean).map(Number);
      if (nums.length === 0) return "";
      if (nums.length === 1) return `${nums[0]}`;
      if (nums.length === 2)
        return `${nums[0]}:${String(nums[1]).padStart(2, "0")}`;
      return `${nums[0]}:${String(nums[1]).padStart(2, "0")}:${String(
        nums[2]
      ).padStart(2, "0")}`;
    } catch {
      return "";
    }
  };

  return (
    <>
      <div className="input-group mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Pesquise por músicas"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch()}
          disabled={isLoading}
        />
        <button
          className="btn btn-primary"
          onClick={onSearch}
          style={{ border: "none", height: "50px" }}
          disabled={isLoading}
        >
          <i className="bi bi-search" />
        </button>
      </div>

      <div className="container mb-5">
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {searchResults.map((item) => {
            const videoId = item.id?.videoId || item.id;
            const thumb =
              item.snippet?.thumbnails?.high?.url ||
              item.snippet?.thumbnails?.default?.url;
            const duration = item.contentDetails?.duration
              ? formatDuration(item.contentDetails.duration)
              : "";

            return (
              <div key={videoId} className="col-music">
                <div className="yt-col">
                  <div className="yt-card w-100">
                    <div className="yt-thumb-wrap">
                      <img
                        src={thumb}
                        alt={item.snippet?.title}
                        className="yt-thumb"
                      />
                      {duration && (
                        <div className="duration-badge">{duration}</div>
                      )}
                    </div>
                    <div className="card-title-yt" title={item.snippet?.title}>
                      {item.snippet?.title}
                    </div>
                    <div className="channel-row">
                      <span>{item.snippet?.channelTitle}</span>
                      <span>•</span>
                      <span>{Math.floor(Math.random() * 10) + 1}M</span>
                    </div>
                    <div className="card-actions mt-5">
                      <button
                        className="add-btn"
                        onClick={() => onAddVideo(videoId, item.snippet?.title)}
                        disabled={isLoading}
                      >
                        + Adicionar
                      </button>
                      <button
                        className="icon-btn"
                        title="Adicionar e baixar"
                        onClick={() =>
                          onAddAndDownload(videoId, item.snippet?.title)
                        }
                        disabled={isLoading}
                      >
                        <i className="bi bi-download" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default SearchSection;
