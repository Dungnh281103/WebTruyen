import React from "react";
import { Link } from "react-router-dom";
import "./Footer.scss"; // File CSS cho Footer
import logo1 from "../../assets/img/logo1.webp";

function Footer() {
  const currentYear = new Date().getFullYear(); // Lấy năm hiện tại

  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-links">
          <Link to="/gioi-thieu">Giới thiệu</Link>
          <Link to="/lien-he">Liên hệ</Link>
          <Link to="/dieu-khoan">Điều khoản dịch vụ</Link>
          <Link to="/chinh-sach-bao-mat">Chính sách bảo mật</Link>
          {/* Thêm các link khác nếu cần */}
        </div>
        <div>
          SoraTruyenChu là nền tảng mở trực tuyến, miễn phí đọc truyện chữ được
          đóng góp nội dung từ các tác giả viết truyện và các dịch giả convert,
          dịch truyện, rất nhiều truyện hay và nổi bật được cập nhật nhanh nhất
          với đủ các thể loại tiên hiệp, kiếm hiệp, huyền ảo ...
        </div>
        <div className="footer-logo">
          <Link to="/">
            {/* Thay bằng thẻ img với logo của bạn */}
            <img
              src={logo1}
              alt="Logo Website"
              style={{ height: "50px", display: "block" }}
            />
            {/* Hoặc Text Logo */}
            {/* <span style={{fontSize: '1.8em', fontWeight: 'bold'}}>Tên Web</span> */}
          </Link>
        </div>
        <div className="footer-copyright">
          © {currentYear} Sora. All rights reserved.
          {/* Bạn có thể thêm thông tin khác */}
          <p>Phát triển bởi [Sora]</p>
        </div>
        {/* Có thể thêm icon mạng xã hội ở đây */}
      </div>
    </footer>
  );
}

export default Footer;
