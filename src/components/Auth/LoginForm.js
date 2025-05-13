import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faSpinner } from '@fortawesome/free-solid-svg-icons';

const LoginForm = ({ onLogin, onSwitchForm, error, isLoading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({ email, password });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="email"
          className="form-input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
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
          disabled={isLoading}
          required
        />
        <button
          type="button"
          className="toggle-password-btn"
          onClick={togglePasswordVisibility}
          disabled={isLoading}
        >
          <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="auth-buttons">
        <button type="submit" className="auth-button primary-button" disabled={isLoading}>
          {isLoading ? (
            <>
              <FontAwesomeIcon icon={faSpinner} spin className="loading-icon" />
              <span>Đang đăng nhập...</span>
            </>
          ) : (
            'Đăng nhập'
          )}
        </button>
      </div>

      <p className="forgot-text">Quên mật khẩu?</p>
      <p className="toggle-text" onClick={isLoading ? null : onSwitchForm}>
        Chưa có tài khoản? <span>Đăng ký ngay</span>
      </p>
    </form>
  );
};

export default LoginForm;