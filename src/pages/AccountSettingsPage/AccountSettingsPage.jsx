import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import AccountSettings from "./components/AccountSettings";
import SecuritySettings from "./components/SecuritySettings";
import { useAuth } from "../../apis/authContext";
import "./AccountSettingsPage.scss";

function AccountSettingsPage() {
  const { currentUser, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("account");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // Simulate loading user data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [isAuthenticated, navigate]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div>
      <Header />
      <div className="account-settings-page">
        <div className="container">
          <h1 className="page-title">Cài đặt tài khoản</h1>

          <div className="settings-tabs">
            <button
              className={`tab-btn ${activeTab === "account" ? "active" : ""}`}
              onClick={() => handleTabChange("account")}
            >
              Cài đặt tài khoản
            </button>
            <button
              className={`tab-btn ${activeTab === "security" ? "active" : ""}`}
              onClick={() => handleTabChange("security")}
            >
              Cài đặt bảo mật
            </button>
          </div>

          <div className="settings-content">
            {isLoading ? (
              <div className="loading-indicator">
                Đang tải thông tin tài khoản...
              </div>
            ) : activeTab === "account" ? (
              <AccountSettings user={currentUser} />
            ) : (
              <SecuritySettings user={currentUser} />
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AccountSettingsPage;
