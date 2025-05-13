import React, { useState, useEffect } from "react";
import "./DangTruyenPage.scss";
import PostedStories from "./PostedStories";
import NewStoryForm from "./NewStoryForm";

export default function DangTruyenPage() {
  const [activeTab, setActiveTab] = useState("posted");

  return (
    <div className="dang-truyen-page container">
      <h1>Quản lý đăng truyện</h1>
      <div className="tabs">
        <button
          className={activeTab === "posted" ? "tab active" : "tab"}
          onClick={() => setActiveTab("posted")}
        >
          Đã đăng
        </button>
        <button
          className={activeTab === "new" ? "tab active" : "tab"}
          onClick={() => setActiveTab("new")}
        >
          Thêm mới
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "posted" ? <PostedStories /> : <NewStoryForm />}
      </div>
    </div>
  );
}
