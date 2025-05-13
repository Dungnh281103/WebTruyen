import React, { useState } from "react";
import { FaCamera, FaCheck } from "react-icons/fa";
import "../AccountSettingsPage.scss";

const sortOptions = {
  reading: [
    { value: "recently_read", label: "Mới đọc" },
    { value: "newest_chapter", label: "Chương mới" },
    { value: "title", label: "Tên truyện" },
  ],
  bookmarks: [
    { value: "newest_chapter", label: "Chương mới" },
    { value: "recently_saved", label: "Mới lưu" },
    { value: "title", label: "Tên truyện" },
  ],
};

const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 100 }, (_, i) => currentYear - i);

function AccountSettings({ user }) {
  // Get default values from user or set defaults
  const [formData, setFormData] = useState({
    avatar: user?.avatar_url || "",
    username: user?.username || "",
    displayName: user?.display_name || "",
    birthYear: user?.birth_year || currentYear - 20,
    sortReading: user?.preferences?.sort_reading || "recently_read",
    sortBookmarks: user?.preferences?.sort_bookmarks || "newest_chapter",
  });

  const [avatarPreview, setAvatarPreview] = useState(user?.avatar_url || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result);
        setFormData({ ...formData, avatar: file });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage("");

    try {
      // Simulate API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Account settings updated:", formData);
      setSuccessMessage("Cài đặt tài khoản đã được cập nhật thành công!");

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
    } catch (error) {
      console.error("Error updating account settings:", error);
      alert("Có lỗi xảy ra khi cập nhật cài đặt. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="settings-section account-settings">
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h2>Thông tin cá nhân</h2>

          <div className="avatar-upload">
            <div
              className="avatar-preview"
              style={{
                backgroundImage: `url(${
                  avatarPreview || "/default-avatar.png"
                })`,
              }}
            >
              <label htmlFor="avatar-input" className="avatar-edit">
                <FaCamera />
                <input
                  type="file"
                  id="avatar-input"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
            </div>
            <p className="avatar-help">
              Nhấp vào hình ảnh để thay đổi ảnh đại diện
            </p>
          </div>

          {/* <div className="form-group">
            <label htmlFor="username">Tên đăng nhập</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              disabled // Username cannot be changed
              className="disabled-input"
            />
            <p className="field-note">Tên đăng nhập không thể thay đổi</p>
          </div> */}

          <div className="form-group">
            <label htmlFor="displayName">Tên hiển thị</label>
            <input
              type="text"
              id="displayName"
              name="displayName"
              value={formData.displayName}
              onChange={handleInputChange}
              placeholder="Nhập tên hiển thị"
            />
          </div>

          <div className="form-group">
            <label htmlFor="birthYear">Năm sinh</label>
            <select
              id="birthYear"
              name="birthYear"
              value={formData.birthYear}
              onChange={handleInputChange}
            >
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-section">
          <h2>Tùy chọn hiển thị</h2>

          <div className="form-group">
            <label htmlFor="sortReading">Sắp xếp truyện đang đọc</label>
            <select
              id="sortReading"
              name="sortReading"
              value={formData.sortReading}
              onChange={handleInputChange}
            >
              {sortOptions.reading.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="sortBookmarks">Sắp xếp truyện đánh dấu</label>
            <select
              id="sortBookmarks"
              name="sortBookmarks"
              value={formData.sortBookmarks}
              onChange={handleInputChange}
            >
              {sortOptions.bookmarks.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {successMessage && (
          <div className="success-message">
            <FaCheck /> {successMessage}
          </div>
        )}

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang cập nhật..." : "Cập nhật"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AccountSettings;
