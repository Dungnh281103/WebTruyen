import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';


const RegisterForm = ({ onRegister, onSwitchForm }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Mật khẩu không khớp!');
      return;
    }
    onRegister({ username, email, password });
  };


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };


  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="text"
          className="form-input"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      
      <div className="form-group">
        <input
          type="email"
          className="form-input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
      
      <div className="form-group password-group">
        <input
          type={showConfirmPassword ? "text" : "password"}
          className="form-input"
          placeholder="Xác nhận mật khẩu"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button 
          type="button" 
          className="toggle-password-btn"
          onClick={toggleConfirmPasswordVisibility}
        >
          <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
        </button>
      </div>
      
      <div className="auth-buttons">
        <button type="submit" className="auth-button primary-button">
          Đăng ký
        </button>
      </div>
      
      <p className="toggle-text" onClick={onSwitchForm}>
        Đã có tài khoản? <span>Đăng nhập</span>
      </p>
    </form>
  );
};


export default RegisterForm;
