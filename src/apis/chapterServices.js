import { API_URL } from "../constants/apis.js";
import { fetchWithAuth } from "./apiClient";

export async function fetchAllChapter(storyId) {
  const response = await fetch(`${API_URL}chapter/${storyId}`);
  return await response.json();
}

// Lấy nội dung và thông tin chi tiết của một chương
export async function fetchChapterById(Id) {
  const res = await fetch(`${API_URL}api/Chapter/${Id}`);
  if (!res.ok) throw new Error(`Failed to load chapter ${Id}: ${res.status}`);
  return await res.json();
}

/**
 * Reads a chapter: increments view count, saves reading history, and returns chapter data
 * @param {string} chapterId - ID of the chapter to read
 * @returns {Promise<Object>} - { chapterViews, storyViews, chapter }
 */
export async function readChapter(chapterId) {
  const response = await fetchWithAuth(`api/Chapter/${chapterId}/view`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to read chapter: ${response.status}`);
  }

  return await response.json();
}

/**
 * Gets reading history for the current user
 * @returns {Promise<Array>} - List of reading history entries
 */
export async function fetchReadingHistory() {
  const response = await fetchWithAuth("api/ReadingHistory");

  if (!response.ok) {
    throw new Error(`Failed to fetch reading history: ${response.status}`);
  }

  return await response.json();
}

/**
 * Gets the last read chapter for a specific story
 * @param {string} storyId - ID of the story
 * @returns {Promise<Object|null>} - Reading history entry or null if not found
 */
export async function getLastReadChapter(storyId) {
  try {
    const response = await fetchWithAuth(`api/ReadingHistory/story/${storyId}`);

    if (!response.ok) {
      if (response.status === 404) {
        return null; // Story hasn't been read yet
      }
      throw new Error(`Failed to fetch last read chapter: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching last read chapter:", error);
    return null;
  }
}

// Gọi API tăng view và trả về số view mới
