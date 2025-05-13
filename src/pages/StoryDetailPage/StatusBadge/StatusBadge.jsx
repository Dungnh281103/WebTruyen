import React from "react";
import "./StatusBadge.scss";

function StatusBadge({ status }) {
  // Convert status to display text and determine class
  const getStatusInfo = (status) => {
    switch (status) {
      case "Đang ra":
        return { text: "Đang Ra", className: "ongoing" };
      case "Hoàn thành":
        return { text: "Hoàn Thành", className: "completed" };
      case "dropped":
        return { text: "Ngưng Xuất Bản", className: "dropped" };
      case "hiatus":
        return { text: "Tạm Ngưng", className: "hiatus" };
      default:
        return { text: "Không Rõ", className: "unknown" };
    }
  };

  const statusInfo = getStatusInfo(status);

  return (
    <div className={`status-badge ${statusInfo.className}`}>
      {statusInfo.text}
    </div>
  );
}

export default StatusBadge;
