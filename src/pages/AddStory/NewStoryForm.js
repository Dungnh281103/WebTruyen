import React, { useState } from "react";
import "./NewStoryForm.scss";

// Dữ liệu danh sách
const options = {
  genres: [
    "Tiên Hiệp",
    "Huyền Huyễn",
    "Khoa Huyễn",
    "Võng Du",
    "Đô Thị",
    "Đồng Nhân",
    "Dã Sử",
    "Cạnh Kỹ",
    "Huyền Nghi",
    "Kiếm Hiệp",
    "Kỳ Ảo",
    "Light Novel",
  ],
  personalities: [
    "Điềm Đạm",
    "Nhiệt Huyết",
    "Vô Sỉ",
    "Thiết Huyết",
    "Nhẹ Nhàng",
    "Cơ Trí",
    "Lãnh Khốc",
    "Kiêu Ngạo",
    "Ngu Ngốc",
    "Giảo Hoạt",
  ],
  worlds: [
    "Đông Phương Huyền Huyễn",
    "Dị Thế Đại Lục",
    "Vương Triều Tranh Bá",
    "Cao Võ Thế Giới",
    "Tây Phương Kỳ Huyễn",
    "Hiện Đại Ma Pháp",
    "Hắc Ám Huyễn Tưởng",
    "Lịch Sử Thần Thoại",
    "Võ Hiệp Huyễn Tưởng",
    "Cổ Võ Tương Lai",
    "Tu Chân Văn Minh",
    "Huyễn Tưởng Tu Tiên",
    "Hiện Đại Tu Chân",
    "Thần Thoại Tu Chân",
    "Cổ Điển Tiên Hiệp",
    "Viễn Cổ Hồng Hoang",
    "Đô Thị Sinh Hoạt",
    "Đô Thị Dị Năng",
    "Thanh Xuân Vườn Trường",
    "Ngu Nhạc Minh Tinh",
    "Thương Chiến Chức Tràng",
    "Giá Không Lịch Sử",
    "Lịch Sử Quân Sự",
    "Dân Gian Truyền Thuyết",
    "Lịch Sử Quan Trường",
    "Hư Nghĩ Võng Du",
    "Du Hí Dị Giới",
    "Điện Tử Cạnh Kỹ",
    "Thể Dục Cạnh Kỹ",
    "Cổ Võ Cơ Giáp",
    "Thế Giới Tương Lai",
    "Tinh Tế Văn Minh",
    "Tiến Hóa Biến Dị",
    "Mạt Thế Nguy Cơ",
    "Thời Không Xuyên Toa",
    "Quỷ Bí Huyền Nghi",
    "Kỳ Diệu Thế Giới",
    "Trinh Tham Thôi Lý",
    "Thám Hiểm Sinh Tồn",
    "Cung Vi Trạch Đấu",
    "Kinh Thương Chủng Điền",
    "Tiên Lữ Kỳ Duyên",
    "Hào Môn Thế Gia",
    "Dị Tộc Luyến Tình",
    "Ma Pháp Huyễn Tình",
    "Tinh Tế Luyến Ca",
    "Linh Khí Khôi Phục",
    "Chư Thiên Vạn Giới",
    "Nguyên Sinh Huyễn Tưởng",
    "Yêu Đương Thường Ngày",
    "Diễn Sinh Đồng Nhân",
    "Cáo Tiếu Thổ Tào",
  ],
  sects: [
    "Hệ Thống",
    "Lão Gia",
    "Bàn Thờ",
    "Tùy Thân",
    "Phàm Nhân",
    "Vô Địch",
    "Xuyên Qua",
    "Nữ Cường",
    "Khế Ước",
    "Trọng Sinh",
    "Hồng Lâu",
    "Học Viện",
    "Biến Thân",
    "Cổ Ngu",
    "Chuyển Thế",
    "Xuyên Sách",
    "Đàn Xuyên",
    "Phế Tài",
    "Dưỡng Thành",
    "Cơm Mềm",
    "Vô Hạn",
    "Mary Sue",
    "Cá Mặn",
    "Xây Dựng Thế Lực",
    "Xuyên Nhanh",
    "Nữ Phụ",
    "Vả Mặt",
    "Sảng Văn",
    "Xuyên Không",
    "Ngọt Sủng",
    "Ngự Thú",
    "Điền Viên",
    "Toàn Dân",
    "Mỹ Thực",
    "Phản Phái",
    "Sau Màn",
    "Thiên Tài",
  ],
  genders: ["Truyện nam", "Truyện nữ", "Phi Giới Tính"],
};

export default function NewStoryForm() {
  const [form, setForm] = useState({
    title: "",
    gender: "Truyện nam",
    intro: "",
    genre: [],
    personality: "",
    world: "",
    sect: "",
    cover: null,
    agreed: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setForm((f) => ({ ...f, [name]: checked }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleSelect = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleFile = (e) => {
    setForm((f) => ({ ...f, cover: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: gọi API POST /api/my-stories
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    // fetch('/api/my-stories', { method: 'POST', body: data })...
    console.log("Submit", form);
  };

  return (
    <form className="new-story-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Tên truyện</label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          placeholder=""
        />
      </div>

      <div className="form-group">
        <label>Giới tính</label>
        <div className="dropdown-select">
          <select name="gender" value={form.gender} onChange={handleSelect}>
            {options.genders.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Giới thiệu</label>
        <textarea
          name="intro"
          value={form.intro}
          onChange={handleChange}
          rows={6}
          placeholder=""
        />
      </div>

      <div className="form-group">
        <label>Thể loại</label>
        <div className="dropdown-select">
          <select name="genre" value={form.genre} onChange={handleSelect}>
            <option value="" disabled selected>
              Vui lòng chọn
            </option>
            {options.genres.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Tính cách nhân vật chính</label>
        <div className="dropdown-select">
          <select
            name="personality"
            value={form.personality}
            onChange={handleSelect}
          >
            <option value="" disabled selected>
              Vui lòng chọn
            </option>
            {options.personalities.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Bối cảnh thế giới</label>
        <div className="dropdown-select">
          <select name="world" value={form.world} onChange={handleSelect}>
            <option value="" disabled selected>
              Vui lòng chọn
            </option>
            {options.worlds.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Lưu phái</label>
        <div className="dropdown-select">
          <select name="sect" value={form.sect} onChange={handleSelect}>
            <option value="" disabled selected>
              Vui lòng chọn
            </option>
            {options.sects.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-submit" disabled={!form.agreed}>
          Tiếp Theo
        </button>
      </div>
    </form>
  );
}
