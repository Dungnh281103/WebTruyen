import { API_URL } from "../constants/apis.js";

/**
 * Lấy access token từ localStorage
 * 
 */
function getAccessToken() {
  return localStorage.getItem("accessToken");
}

/**
 * Tạo headers với access token cho yêu cầu API
 * 
 */
function createAuthHeaders() {
  const headers = new Headers({
    "Content-Type": "application/json",
  });

  const token = getAccessToken();
  if (token) {
    headers.append("Authorization", `Bearer ${token}`);
  }

  return headers;
}

// Lưu truyện
export async function saveStory(storyId) {
  const response = await fetch(`${API_URL}api/SavedStory`, {
    method: "POST",
    headers: createAuthHeaders(),
    body: JSON.stringify({ storyId }),
  });
  if (!response.ok) throw new Error("Failed to save story");
  return await response.json();
}

// Hủy lưu truyện
export async function unsaveStory(storyId) {
  const response = await fetch(`${API_URL}api/SavedStory/${storyId}`, {
    method: "DELETE",
    headers: createAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to unsave story");
}

// Kiểm tra đã lưu chưa
export async function isStorySaved(storyId) {
  const response = await fetch(`${API_URL}api/SavedStory/is-saved/${storyId}`, {
    headers: createAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to check saved status");
  const flag = await response.json();
  return flag;
}

//lấy danh sách đã lưu
export async function fetchSavedStory() {
  const headers = createAuthHeaders();

  const response = await fetch(`${API_URL}api/SavedStory`, {
    headers: headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Unauthorized: Please login again");
    }
    throw new Error("Failed to fetch saved stories");
  }

  // Lấy dữ liệu từ phản hồi
  const data = await response.json();

  // Phản hồi API của bạn trả về một mảng trực tiếp, không có thuộc tính 'storys'
  return data || [];
}


export async function removeSavedStory(storyId) {
  const headers = createAuthHeaders();

  const response = await fetch(`${API_URL}api/SavedStory/${storyId}`, {
    method: "DELETE",
    headers: headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Unauthorized: Please login again");
    }
    throw new Error("Failed to remove saved story");
  }
}
