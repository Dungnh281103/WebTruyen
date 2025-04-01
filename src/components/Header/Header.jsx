import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaUserCircle } from 'react-icons/fa';
import logo from '../../assets/img/logo.png';
import './Header.scss';
import AuthModal from '../Auth/LoginModal';// Import AuthModal

function Header() {
  const isLoggedIn = false;
  const user = isLoggedIn ? { username: 'DemoUser', avatarUrl: null } : null;

  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isUserMenuVisible, setIsUserMenuVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const userMenuRef = useRef(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false); // State cho modal đăng nhập/đăng ký
  const [isLoginModal, setIsLoginModal] = useState(true); // State xác định modal đăng nhập hay đăng ký

  const handleSearchSubmit = (event) => {
    if (event.key === 'Enter' && searchTerm.trim()) {
      setIsSearchVisible(false);
      navigate(`/tim-kiem?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuVisible(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuRef]);

  const handleLogout = () => {
    setIsUserMenuVisible(false);
    alert('Đăng xuất thành công (Demo)');
    navigate('/');
  };

  const openAuthModal = (isLogin) => {
    setIsLoginModal(isLogin);
    setIsAuthModalOpen(true);
  };

  return (
    <header className="site-header">
      <div className="header-container">
        <div className="header-search">
          <button
            className="search-icon-btn"
            onClick={() => setIsSearchVisible(!isSearchVisible)}
            aria-label="Tìm kiếm"
          >
            <FaSearch />
          </button>
          {isSearchVisible && (
            <input
              type="search"
              placeholder="Tìm truyện..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearchSubmit}
              autoFocus
            />
          )}
        </div>

        <div className="header-logo">
          <Link to="/">
            <img src={logo} alt="Logo Website" style={{ height: '40px', display: 'block' }} />
          </Link>
        </div>

        <div className="header-user-actions">
          {isLoggedIn && user ? (
            <div className="user-menu-container" ref={userMenuRef}>
              <button
                className="user-avatar-btn"
                onClick={() => setIsUserMenuVisible(!isUserMenuVisible)}
                aria-label="Menu người dùng"
              >
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.username} className="user-avatar-img" />
                ) : (
                  <FaUserCircle className="user-avatar-icon" />
                )}
              </button>
              {isUserMenuVisible && (
                <ul className="user-dropdown-menu">
                  <li>
                    <Link to="/tu-truyen" onClick={() => setIsUserMenuVisible(false)}>
                      Tủ truyện
                    </Link>
                  </li>
                  <li>
                    <Link to="/lich-su-doc" onClick={() => setIsUserMenuVisible(false)}>
                      Lịch sử đọc
                    </Link>
                  </li>
                  <li>
                    <Link to="/tai-khoan" onClick={() => setIsUserMenuVisible(false)}>
                      Tài khoản
                    </Link>
                  </li>
                  <li>
                    <hr />
                  </li>
                  <li>
                    <button onClick={handleLogout} className="logout-button">
                      Đăng xuất
                    </button>
                  </li>
                </ul>
              )}
            </div>
          ) : (
            <div className="auth-links">
              <button className="auth-link login-link" onClick={() => openAuthModal(true)}>
                Đăng nhập
              </button>
              <button className="auth-link register-link" onClick={() => openAuthModal(false)}>
                Đăng ký
              </button>
            </div>
          )}
        </div>
      </div>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} isLogin={isLoginModal}/>
    </header>
  );
}

export default Header;