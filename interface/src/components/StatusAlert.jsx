import React from "react";

const StatusAlert = ({ isLoading, downloadStatus }) => {
  if (isLoading || !downloadStatus) return null;

  return <div className="alert alert-success mt-3">{downloadStatus}</div>;
};

export default StatusAlert;
