import React, { useState, useEffect } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm.js';
import './AuthModal.scss';

const AuthModal = ({ isOpen, onClose, onAuthSuccess, initialMode }) => {
  const [showLoginForm, setShowLoginForm] = useState(initialMode === 'login');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setShowLoginForm(initialMode === 'login');
      setLoginError(''); // Clear any errors when mode changes
    }
  }, [isOpen, initialMode]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '15px';
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isOpen]);

  const handleLogin = async (credentials) => {
    try {
      setLoginError('');
      
      // Fetch users from user.json (fixed filename)
      const response = await fetch('/data/user.json');
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      
      const userData = await response.json();
      console.log('Fetched user data:', userData);
      // Find user with matching credentials (updated to use password_hash)
      const user = userData.users.find(
        u => (u.email === credentials.username || u.username === credentials.username) && 
             u.password_hash === credentials.password
      );
      
      if (!user) {
        setLoginError('Tên đăng nhập hoặc mật khẩu không đúng');
        return;
      }
      
      // Create token (in a real app, this would be a JWT from the server)
      const token = btoa(JSON.stringify({
        userId: user.id,
        timestamp: new Date().getTime()
      }));
      
      // Store token in localStorage
      localStorage.setItem('userToken', token);
      localStorage.setItem('userId', user.id);
      
      // Remove sensitive data before storing user info
      const { password_hash, ...safeUserData } = user;
      localStorage.setItem('userData', JSON.stringify(safeUserData));
      
      // Notify parent component about successful login
      if (onAuthSuccess) {
        onAuthSuccess(safeUserData);
      }
      
      onClose();
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại sau.');
    }
  };

  const handleRegister = async (userData) => {
    try {
      // In a real app, this would send data to the server
      // For now, we'll simulate a successful registration
      
      // Create a new user object
      const newUser = {
        id: `user_${Date.now()}`,
        username: userData.username,
        email: userData.email,
        password: userData.password,
        displayName: userData.username,
        avatar: '/images/default-avatar.png',
        created_at: new Date().toISOString()
      };
      
      // In a real app, we would send this to the server
      console.log('Register new user:', newUser);
      
      // Auto login after registration
      await handleLogin({
        username: userData.username,
        password: userData.password
      });
      
    } catch (error) {
      console.error('Registration error:', error);
      alert('Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại sau.');
    }
  };

  // Switch to login form
  const switchToLoginForm = () => {
    setShowLoginForm(true);
    setLoginError('');
  };

  // Switch to register form
  const switchToRegisterForm = () => {
    setShowLoginForm(false);
    setLoginError('');
  };

  if (!isOpen) return null;

  return (
    <div className="modal-container">
      <div className="modal-backdrop" onClick={onClose}></div>
      
      <div className="auth-modal">
        <div className="modal-content">
          <button className="close-button" onClick={onClose}>×</button>
          
          <div className="modal-header">
            <h4>{showLoginForm ? 'Đăng nhập' : 'Đăng ký'}</h4>
          </div>
          
          <div className="modal-body">
            {showLoginForm ? (
              <LoginForm 
                onLogin={handleLogin} 
                onSwitchForm={switchToRegisterForm}
                error={loginError}
              />
            ) : (
              <RegisterForm 
                onRegister={handleRegister} 
                onSwitchForm={switchToLoginForm} 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;