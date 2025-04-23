import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const LoginForm = ({ onLogin, onSwitchForm, error }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({ username, password });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="text"
          className="form-input"
          placeholder="Username/Email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      
      <div className="form-group password-group">
        <input
          type={showPassword ? "text" : "password"}
          className="form-input"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button 
          type="button" 
          className="toggle-password-btn"
          onClick={togglePasswordVisibility}
        >
          <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
        </button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="auth-buttons">
        <button type="submit" className="auth-button primary-button">
          Đăng nhập
        </button>
      </div>
      
      <p className="forgot-text">Quên mật khẩu?</p>
      <p className="toggle-text" onClick={onSwitchForm}>
        Chưa có tài khoản? <span>Đăng ký ngay</span>
      </p>
    </form>
  );
};

export default LoginForm;