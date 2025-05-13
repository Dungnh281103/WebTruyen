import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
// import logo from "../../assets/img/logo.png";
import logo1 from "../../assets/img/logo1.webp";

import "./Header.scss";
import AuthModal from "../Auth/AuthModal";
import UserMenu from "./UserMenu/UserMenu";
import { useAuth } from "../../apis/authContext";
import { fetchStories } from "../../apis/storyServices";

function Header() {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [initialAuthMode, setInitialAuthMode] = useState("login");
  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);
  const navigate = useNavigate();

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim()) {
      setIsLoading(true);
      performSearch(value);
    } else {
      setSearchResults([]);
    }
  };

  // Perform search without debounce
  const performSearch = async (query) => {
    try {
      const results = await fetchStories(query);
      setSearchResults(results);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (event) => {
    if (event.key === "Enter" && searchTerm.trim()) {
      navigate(`/tim-kiem?q=${encodeURIComponent(searchTerm.trim())}`);
      setIsSearchVisible(false);
      setSearchResults([]);
      setSearchTerm("");
    }
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setIsSearchVisible(false);
        setSearchResults([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Focus input when search becomes visible
  useEffect(() => {
    if (isSearchVisible && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchVisible]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const openAuthModal = (mode) => () => {
    setInitialAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = (userData) => {
    setIsAuthModalOpen(false);
  };

  // Navigate to story details when clicking on a search result
  const handleResultClick = (story) => {
    navigate(`/story/${story.id}`);
    setIsSearchVisible(false);
    setSearchResults([]);
    setSearchTerm("");
  };

  return (
    <header className="site-header">
      <div className="header-container">
        <div className="header-search">
          <div className="search-container" ref={searchContainerRef}>
            <button
              className="search-icon-btn"
              onClick={() => setIsSearchVisible(!isSearchVisible)}
              aria-label="Tìm kiếm"
            >
              <FaSearch />
            </button>
            {isSearchVisible && (
              <input
                ref={searchInputRef}
                type="search"
                placeholder="Tìm truyện..."
                className="search-input"
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyDown={handleSearchSubmit}
              />
            )}

            {/* Search Results Display - Outside of conditional rendering for input */}
            {isSearchVisible && searchTerm.trim() && (
              <div className="search-results-container">
                {isLoading ? (
                  <div className="search-loading">Đang tìm kiếm...</div>
                ) : searchResults.length > 0 ? (
                  <ul className="search-results-list">
                    {searchResults.map((story) => (
                      <li
                        key={story._id || story.id}
                        onClick={() => handleResultClick(story)}
                      >
                        <div className="search-result-item">
                          {story.coverImage && (
                            <img
                              src={story.coverImage}
                              alt={story.title}
                              className="search-result-image"
                            />
                          )}
                          <div className="search-result-info">
                            <h4 className="search-result-title">
                              {story.title}
                            </h4>
                            {story.author && (
                              <p className="search-result-author">
                                {story.author}
                              </p>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="search-no-results">
                    Không tìm thấy kết quả
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="header-logo">
          <Link to="/">
            <img
              src={logo1}
              alt="Logo Website"
              style={{ height: "50px", display: "block" }}
            />
          </Link>
        </div>

        <div className="header-user-actions">
          {isAuthenticated && currentUser ? (
            <UserMenu user={currentUser} onLogout={handleLogout} />
          ) : (
            <div className="auth-links">
              <button
                className="btn auth-btn login-btn"
                onClick={openAuthModal("login")}
              >
                Đăng nhập
              </button>
              <button
                className="btn auth-btn register-btn"
                onClick={openAuthModal("register")}
              >
                Đăng ký
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Only show the Auth Modal if not authenticated */}
      {!isAuthenticated && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onAuthSuccess={handleAuthSuccess}
          initialMode={initialAuthMode}
        />
      )}
    </header>
  );
}

export default Header;
