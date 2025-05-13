import React, { useState, useEffect } from "react";
import LoginForm from "./LoginForm.js";
import RegisterForm from "./RegisterForm.js";
import { useAuth } from "../../apis/authContext";
import "./AuthModal.scss";

const AuthModal = ({ isOpen, onClose, onAuthSuccess, initialMode }) => {
  const [showLoginForm, setShowLoginForm] = useState(initialMode === "login");
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useAuth();

  useEffect(() => {
    if (isOpen) {
      setShowLoginForm(initialMode === "login");
      setLoginError("");
    }
  }, [isOpen, initialMode]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = "15px";
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [isOpen]);

  const handleLogin = async (credentials) => {
    try {
      setIsLoading(true);
      setLoginError("");

      await login(credentials);

      if (onAuthSuccess) {
        const userData = JSON.parse(localStorage.getItem("userData"));
        onAuthSuccess(userData);
      }

      onClose();
    } catch (error) {
      console.error("Login error:", error);
      setLoginError(
        error.message || "Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại sau."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (userData) => {
    try {
      setIsLoading(true);

      await register(userData);

      if (onAuthSuccess) {
        const userData = JSON.parse(localStorage.getItem("userData"));
        onAuthSuccess(userData);
      }

      onClose();
    } catch (error) {
      console.error("Registration error:", error);
      alert(
        error.message || "Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại sau."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const switchToLoginForm = () => {
    setShowLoginForm(true);
    setLoginError("");
  };

  const switchToRegisterForm = () => {
    setShowLoginForm(false);
    setLoginError("");
  };

  if (!isOpen) return null;

  return (
    <div className="modal-container">
      <div className="modal-backdrop" onClick={onClose}></div>

      <div className="auth-modal">
        <div className="modal-content">
          <button className="close-button" onClick={onClose}>
            ×
          </button>

          <div className="modal-header">
            <h4>{showLoginForm ? "Đăng nhập" : "Đăng ký"}</h4>
          </div>

          <div className="modal-body">
            {showLoginForm ? (
              <LoginForm
                onLogin={handleLogin}
                onSwitchForm={switchToRegisterForm}
                error={loginError}
                isLoading={isLoading}
              />
            ) : (
              <RegisterForm
                onRegister={handleRegister}
                onSwitchForm={switchToLoginForm}
                isLoading={isLoading}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
