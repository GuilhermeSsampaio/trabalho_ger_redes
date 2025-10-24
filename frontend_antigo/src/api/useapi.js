const useAPI = () => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5173";

  const searchVideos = async (query) => {};
  const downloadVideos = async (videoUrls, downloadType) => {};
  return { searchVideos, downloadVideos };
};
