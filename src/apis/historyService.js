import { API_URL } from "../constants/apis.js";
import { fetchWithAuth } from "./apiClient";

export async function fetchReadingHistory() {
  const res = await fetchWithAuth(`${API_URL}ReadingHistory`);
  if (!res.ok) {
    throw new Error(`Lỗi khi lấy lịch sử đọc: ${res.status}`);
  }
  return await res.json();
}
