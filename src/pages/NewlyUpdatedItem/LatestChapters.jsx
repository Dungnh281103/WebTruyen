import React, { useState, useEffect } from "react";
import { fetchLatestChapters } from "../../apis/storyServices";
import NewlyUpdatedList from "../../pages/NewlyUpdatedList";

const LatestChapters = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLatestChapters(10)
      .then((data) => setItems(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>Lỗi: {error}</div>;

  return (
    <NewlyUpdatedList items={items} fetchLatestChapters={fetchLatestChapters} />
  );
};

export default LatestChapters;
