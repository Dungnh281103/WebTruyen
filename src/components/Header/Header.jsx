import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaUserCircle } from 'react-icons/fa';
import logo from '../../assets/img/logo.png';
import './Header.scss';
import AuthModal from '../Auth/LoginModal';
import UserMenu from './UserMenu/UserMenu';

function Header() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [initialAuthMode, setInitialAuthMode] = useState('login');
  
  const navigate = useNavigate();

  useEffect(() => {
    checkUserLoginStatus();
  }, []);
  
 
  const logout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userData');
    setIsLoggedIn(false);
    setUser(null);
  };
  
  const checkUserLoginStatus = () => {
    const userToken = localStorage.getItem('userToken');
    if (userToken) {
      const userData = localStorage.getItem('userData');
      if (userData) {
        setUser(JSON.parse(userData));
        setIsLoggedIn(true);
      } else {
        
        fetchUserData();
      }
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  };
  
  const fetchUserData = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        logout();
        return;
      }
      
      try {
      
        const response = await fetch('/data/users.json');
        if (!response.ok) throw new Error('Failed to fetch user data');
        
        const data = await response.json();
        const userData = data.users.find(u => u.id === userId);
        
        if (!userData) {
          logout();
          return;
        }
        
        const { password, ...safeUserData } = userData;
        
    
        if (!safeUserData.display_name && safeUserData.displayName) {
          safeUserData.display_name = safeUserData.displayName;
        }
        
        if (!safeUserData.avatar_url && safeUserData.avatar) {
          safeUserData.avatar_url = safeUserData.avatar;
        }
        
   
        localStorage.setItem('userData', JSON.stringify(safeUserData));
        setUser(safeUserData);
        setIsLoggedIn(true);
      } catch (error) {
        console.warn('Failed to fetch from API, trying localStorage');
        const userData = localStorage.getItem('userData');
        if (userData) {
          setUser(JSON.parse(userData));
          setIsLoggedIn(true);
        } else {
          logout();
        }
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      logout();
    }
  };

  const handleSearchSubmit = (event) => {
    if (event.key === 'Enter' && searchTerm.trim()) {
      setIsSearchVisible(false);
      navigate(`/tim-kiem?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const openAuthModal = (mode) => () => {
    setInitialAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = (userData) => {
    setIsAuthModalOpen(false);
    setUser(userData);
    setIsLoggedIn(true);
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
            <UserMenu user={user} onLogout={handleLogout} />
          ) : (
            <div className="auth-links">
              <button className="btn auth-btn login-btn" onClick={openAuthModal('login')}>
                Đăng nhập
              </button>
              <button className="btn auth-btn register-btn" onClick={openAuthModal('register')}>
                Đăng ký
              </button>
            </div>
          )}
        </div>
      </div>
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        initialMode={initialAuthMode}
      />
    </header>
  );
}

export default Header;