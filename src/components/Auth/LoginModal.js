import React, { useState } from 'react';
import './AuthModal.scss'; // We'll create this SCSS file
import logo from '../../assets/img/logo.png'; // Your logo path

function AuthModal({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Login:', { username, password });
    onClose(); // Close modal after login
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Mật khẩu không khớp!');
      return;
    }
    console.log('Register:', { username, email, password });
    onClose(); // Close modal after registration
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop fade show">
      <div className="modal auth-modal d-block">
        <div className="modal-dialog modal-dialog-centered">

          <div className="modal-content">
            <div className="modal-header border-0">
              <button type="button" className="close" onClick={onClose}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body text-center pb-5">
              <img src={logo} alt="Logo" className="mb-3" width="40" />
              <h4 className="modal-title mb-4">{isLogin ? 'Đăng nhập' : 'Đăng ký'}</h4>
              
              <form onSubmit={isLogin ? handleLogin : handleRegister}>
                {!isLogin && (
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                )}
                
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder={isLogin ? 'Username/Email' : 'Email'}
                    value={isLogin ? username : email}
                    onChange={(e) => (isLogin ? setUsername(e.target.value) : setEmail(e.target.value))}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                {!isLogin && (
                  <div className="form-group">
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Xác nhận mật khẩu"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                )}
                
                <div className="form-group auth-buttons mt-4 d-flex">
                  {isLogin ? (
                    <>
                      <button type="button" className="btn btn-login flex-fill mr-2">
                        <i className="fa fa-sign-in-alt mr-2"></i> Đăng nhập
                      </button>
                      <button type="button" className="btn btn-register flex-fill" onClick={() => setIsLogin(false)}>
                        <i className="fa fa-user-plus mr-2"></i> Đăng ký
                      </button>
                    </>
                  ) : (
                    <>
                      <button type="button" className="btn btn-login flex-fill mr-2" onClick={() => setIsLogin(true)}>
                        <i className="fa fa-sign-in-alt mr-2"></i> Đăng nhập
                      </button>
                      <button type="submit" className="btn btn-register flex-fill">
                        <i className="fa fa-user-plus mr-2"></i> Đăng ký
                      </button>
                    </>
                  )}
                </div>
              </form>
              
              <p className="mt-3 toggle-auth" onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? 'Chưa có tài khoản? Đăng ký ngay' : 'Đã có tài khoản? Đăng nhập'}
              </p>
              
              {isLogin && <p className="forgot-password">Quên mật khẩu?</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthModal;