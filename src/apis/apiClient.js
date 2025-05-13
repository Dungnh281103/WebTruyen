const BASE_URL = 'https://localhost:7057/';

const getAccessToken = () => localStorage.getItem('accessToken');
const getRefreshToken = () => localStorage.getItem('refreshToken');

const saveTokens = (accessToken, refreshToken) => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

const removeTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

// Hàm gọi fetch kèm Bearer token, tự động refresh nếu bị 401
export async function fetchWithAuth(input, init = {}, retry = true) {
  const token = getAccessToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(init.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(BASE_URL + input, {
    ...init,
    headers,
  });

  if (response.status === 401 && retry) {
    const refreshed = await tryRefreshToken();
    if (refreshed) {
      return fetchWithAuth(input, init, false); // Retry sau khi refresh
    } else {
      removeTokens();
      throw new Error('Token hết hạn. Vui lòng đăng nhập lại.');
    }
  }

  return response;
}

// Hàm thử refresh token
async function tryRefreshToken() {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();

  if (!accessToken || !refreshToken) return false;

  try {
    const res = await fetch(BASE_URL + 'auth/refresh-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        AccessToken: accessToken,
        RefreshToken: refreshToken,
      }),
    });

    const data = await res.json();

    if (data.isSuccessed && data.resultObj) {
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } = data.resultObj;
      saveTokens(newAccessToken, newRefreshToken);
      console.log('Đã refresh token');
      return true;
    } else {
      console.error('Refresh token thất bại');
      return false;
    }
  } catch (error) {
    console.error('Lỗi khi refresh token:', error);
    return false;
  }
}
