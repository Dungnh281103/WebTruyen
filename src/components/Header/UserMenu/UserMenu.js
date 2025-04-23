import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle, FaBookmark, FaHistory, FaCog, FaQuestion, 
  FaCrown, FaUpload, FaWarehouse, FaStar, FaSignOutAlt, FaTimes } from 'react-icons/fa';
import './UserMenu.scss';

const UserMenu = ({ user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  
  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuRef]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="user-menu-wrapper" ref={menuRef}>
      <button 
        className="user-menu-toggle" 
        onClick={toggleMenu}
        aria-label="Menu người dùng"
        aria-expanded={isMenuOpen}
      >
        <div className="user-info">
          {user.avatar_url ? (
            <img 
              src={user.avatar_url} 
              alt={user.display_name || user.username} 
              className="user-avatar" 
            />
          ) : (
            <FaUserCircle className="user-icon" />
          )}
        </div>
      </button>

      {isMenuOpen && (
        <div className="user-dropdown">
          <div className="user-dropdown-header">
            <div className="user-profile-summary">
              {user.avatar_url ? (
                <img 
                  src={user.avatar_url} 
                  alt={user.display_name || user.username} 
                  className="user-avatar-large" 
                />
              ) : (
                <FaUserCircle className="user-icon-large" />
              )}
              <div className="user-details">
                <div className="user-display-name">{user.display_name || user.username}</div>
                <span className="badge badge-danger">{user.badge || "0"}</span>
              </div>
            </div>
            <button className="close-menu-btn" onClick={toggleMenu}>
              Thoát
            </button>
          </div>
          
          <nav className="user-menu-nav">
            <ul className="submenu">
              {/* <li>
                <Link to="/nang-cap-tai-khoan" onClick={() => setIsMenuOpen(false)}>
                <span className="bullet">•</span>
                  <span>Nâng cấp tài khoản</span>
                  <span className="new-badge">NEW</span>
                </Link>
              </li> */}
              <li>
                <Link to="/tu-truyen" onClick={() => setIsMenuOpen(false)}>
                    <span className="bullet">•</span>
                  <span>Tủ truyện của tôi</span>
                </Link>
              </li>
              {/* <li>
                <Link to="/lich-su-giao-dich" onClick={() => setIsMenuOpen(false)}>
                <span className="bullet">•</span>
                  <span>Lịch sử giao dịch</span>
                </Link>
              </li> */}
              <li>
                <Link to="/tai-khoan" onClick={() => setIsMenuOpen(false)}>
                <span className="bullet">•</span>
                  <span>Cài đặt cá nhân</span>
                </Link>
              </li>
              <li>
                <Link to="/ho-tro" onClick={() => setIsMenuOpen(false)}>
                <span className="bullet">•</span>
                  <span>Yêu cầu hỗ trợ</span>
                </Link>
              </li>
            </ul>

            

          

            <ul className="sub-menu-items">
              <li>
                <Link to="/dang-truyen" onClick={() => setIsMenuOpen(false)}>
                  <FaUpload className="menu-icon" />
                  <span>Đăng truyện</span>
                </Link>
              </li>
              <li className="submenu-parent">
                <div className="submenu-title">
                  <FaWarehouse className="menu-icon" />
                  <span>Kho truyện</span>
                </div>
                <ul className="submenu">
                  <li>
                    <Link to="/truyen-moi" onClick={() => setIsMenuOpen(false)}>
                      <span className="bullet">•</span>
                      <span>Truyện mới</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/truyen-full" onClick={() => setIsMenuOpen(false)}>
                      <span className="bullet">•</span>
                      <span>Truyện full</span>
                    </Link>
                  </li>
                </ul>
              </li>
              <li className="submenu-parent">
                <div className="submenu-title">
                  <FaStar className="menu-icon" />
                  <span>Xếp hạng</span>
                </div>
                <ul className="submenu">
                  <li>
                    <Link to="/xep-hang-luot-doc" onClick={() => setIsMenuOpen(false)}>
                      <span className="bullet">•</span>
                      <span>Xếp hạng lượt đọc</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/xep-hang-de-cu" onClick={() => setIsMenuOpen(false)}>
                      <span className="bullet">•</span>
                      <span>Xếp hạng đề cử</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/xep-hang-binh-luan" onClick={() => setIsMenuOpen(false)}>
                      <span className="bullet">•</span>
                      <span>Xếp hạng bình luận</span>
                    </Link>
                  </li>
                </ul>
              </li>
              <li className="menu-divider"></li>
              <li>
                <button onClick={onLogout} className="logout-button">
                  <FaSignOutAlt className="menu-icon" />
                  <span>Đăng xuất</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};

export default UserMenu;