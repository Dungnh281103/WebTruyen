import { fetchWithAuth } from '../apis/apiClient';

const BASE_URL = 'https://localhost:7057/';

export const authService = {
  async register(userData) {
    const res = await fetch(BASE_URL + 'auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    return await res.json();
  },

  async login(credentials) {
    const res = await fetch(BASE_URL + 'auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    const data = await res.json();

    if (data.isSuccessed && data.resultObj) {
      const { accessToken, refreshToken } = data.resultObj;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    }

    return data;
  },

  async logout() {
    try {
      // Optional: Gọi API logout nếu có
      // await fetchWithAuth('auth/logout', { method: 'POST' });

      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } catch (error) {
      console.error('Lỗi logout:', error);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  },

  async getCurrentUser() {
    try {
      const res = await fetchWithAuth('user/profile');
      return await res.json();
    } catch (error) {
      console.error('Không thể lấy thông tin người dùng:', error);
      throw error;
    }
  },

  async checkAuth() {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        return { isAuthenticated: false, token: null, user: null };
      }

      return { isAuthenticated: true, token, user: null };
    } catch (error) {
      console.error('Lỗi kiểm tra xác thực:', error);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      return { isAuthenticated: false, token: null, user: null };
    }
  },

  isTokenValid(token) {
    if (!token) return false;

    try {
      const parts = token.split('.');
      if (parts.length !== 3) return false;

      const payload = JSON.parse(atob(parts[1]));
      if (payload.exp) {
        const expiration = new Date(payload.exp * 1000);
        return expiration > new Date();
      }

      return true;
    } catch (err) {
      console.error('Lỗi kiểm tra token:', err);
      return false;
    }
  }
};
