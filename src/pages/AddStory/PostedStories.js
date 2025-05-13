import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaPlus,
  FaList,
  FaEdit,
  FaChartBar,
  FaArrowUp,
  FaSearch,
  FaAngleDoubleLeft,
  FaChevronLeft,
  FaChevronRight,
  FaAngleDoubleRight,
} from "react-icons/fa";
import "./PostedStories.scss";

export default function PostedStories() {
  const [stories, setStories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Còn tiếp");
  const [attrFilter, setAttrFilter] = useState("Thuộc tính");
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // TODO: replace bằng fetch từ API của bạn
    setStories([
      {
        id: "1",
        title: "Bị Bắt Ép Kết Hôn, Ai Ngờ Lão Bà Ta Là Nữ Đế Chuyển Sinh",
        status: "Chờ xuất bản",
        updatedAt: "2025-05-08T14:30:00Z",
        cover:
          "https://i.pinimg.com/1200x/81/dc/3f/81dc3f5a68cfdebce6b8d32f0ec35537.jpg",
      },
    ]);
  }, []);

  // Tạm filter và paging đơn giản
  const filtered = stories.filter((s) =>
    s.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const total = filtered.length;
  const start = (currentPage - 1) * pageSize;
  const paged = filtered.slice(start, start + pageSize);

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  return (
    <div className="posted-stories-page">
      {/* Toolbar */}
      <div className="toolbar">
        <div className="search-box">
          <FaSearch />
          <input
            type="search"
            placeholder="Tìm kiếm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filters">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>Còn tiếp</option>
            <option>Hoàn thành</option>
            <option>Đang ra</option>
          </select>
        </div>
      </div>

      {/* Table header */}
      <div className="stories-header">
        <div className="col title-col">TRUYỆN</div>
        <div className="col publish-col">
          MỚI XUẤT BẢN <FaArrowUp className="sort-icon" />
        </div>
        <div className="col time-col">THỜI GIAN</div>
        <div className="col actions-col" /> {/* blank header for icons */}
      </div>

      {/* Table body */}
      <div className="stories-list">
        {paged.map((story) => (
          <div className="story-item" key={story.id}>
            <div className="col title-col">
              <div className="story-info">
                <img className="cover" src={story.cover} alt={story.title} />
                <div>
                  <div className="title">{story.title}</div>
                  <div className="status">{story.status}</div>
                </div>
              </div>
            </div>

            <div className="col publish-col">{formatDate(story.updatedAt)}</div>

            <div className="col time-col">{formatDate(story.updatedAt)}</div>

            <div className="col actions-col">
              <Link to={`/story/${story.id}/chapters/new`} title="Thêm chương">
                <FaPlus />
              </Link>
              <Link to={`/story/${story.id}/chapters`} title="Danh sách chương">
                <FaList />
              </Link>
              <Link to={`/story/${story.id}/edit`} title="Chỉnh sửa">
                <FaEdit />
              </Link>
              <Link to={`/story/${story.id}/stats`} title="Thống kê">
                <FaChartBar />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <div className="page-size">
          Số dòng trên trang
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(+e.target.value);
              setCurrentPage(1);
            }}
          >
            {[10, 20, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        <div className="range">
          {start + 1}-{Math.min(start + pageSize, total)} of {total}
        </div>

        <div className="controls">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(1)}
          >
            <FaAngleDoubleLeft />
          </button>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            <FaChevronLeft />
          </button>
          <button
            disabled={start + pageSize >= total}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            <FaChevronRight />
          </button>
          <button
            disabled={start + pageSize >= total}
            onClick={() => setCurrentPage(Math.ceil(total / pageSize))}
          >
            <FaAngleDoubleRight />
          </button>
        </div>
      </div>
    </div>
  );
}
