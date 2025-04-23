import { API_URL } from "../constants/apis.js";


// recommend
export async function fetchRecommendedStories() {
  const response = await fetch(`${API_URL}api/Stories/recommended`);
  if (!response.ok) {
    throw new Error(`Failed to fetch recommended stories: ${response.status} ${response.statusText}`);
  }

  const { storys } = await response.json();
  return storys;
}


/**
 * Lấy danh sách tất cả truyện
 * API trả về: { storys: StoryResponseDto[] }
 * @returns {Promise<Array>} Mảng đối tượng truyện
 */
export async function fetchStories() {
  const response = await fetch(`${API_URL}api/Stories`);
  if (!response.ok) {
    throw new Error(`Failed to fetch stories: ${response.status} ${response.statusText}`);
  }

  const { storys } = await response.json();
  return storys;
}

/**
 * Lấy chi tiết truyện theo ID
 * API trả về: { story: StoryResponseDto }
 * @param {string} id - ID của truyện
 * @returns {Promise<Object>} Đối tượng truyện
 */
export async function fetchStoryById(id) {
  const response = await fetch(`${API_URL}api/Stories/${id}`);
  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error(`Failed to fetch story ${id}: ${response.status} ${response.statusText}`);
  }

  const { story } = await response.json();
  return story;
}

/**
 * Tạo truyện mới
 * API nhận CreateStoryDto và trả về CreatedAtAction với { story: StoryResponseDto }
 * @param {Object} storyData - Dữ liệu truyện (title, author, translator, coverUrl, description, status, isRecommended, categoryIds[], tagIds[])
 * @returns {Promise<Object>} Đối tượng truyện đã tạo
 */
export async function createStory(storyData) {
  const response = await fetch(`${API_URL}api/Stories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(storyData)
  });

  if (!response.ok) {
    throw new Error(`Failed to create story: ${response.status} ${response.statusText}`);
  }

  const { story } = await response.json();
  return story;
}

/**
 * Cập nhật truyện theo ID
 * API nhận UpdateStoryDto và trả về { story: StoryResponseDto }
 * @param {string} id - ID của truyện
 * @param {Object} storyData - Dữ liệu truyện cần cập nhật
 * @returns {Promise<Object>} Đối tượng truyện đã cập nhật
 */
export async function updateStory(id, storyData) {
  const response = await fetch(`${API_URL}api/Stories/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(storyData)
  });

  if (!response.ok) {
    throw new Error(`Failed to update story ${id}: ${response.status} ${response.statusText}`);
  }

  const { story } = await response.json();
  return story;
}

/**
 * Xóa truyện theo ID
 * API trả về 204 No Content
 * @param {string} id - ID của truyện
 * @returns {Promise<void>}
 */
export async function deleteStory(id) {
  const response = await fetch(`${API_URL}api/Stories/${id}`, {
    method: "DELETE"
  });

  if (!response.ok) {
    throw new Error(`Failed to delete story ${id}: ${response.status} ${response.statusText}`);
  }
}
