import { API_URL } from "../constants/apis.js";

// recommend
export async function fetchRecommendedStories() {
  const response = await fetch(`${API_URL}api/Stories/recommended`);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch recommended stories: ${response.status} ${response.statusText}`
    );
  }

  const { storys } = await response.json();
  return storys;
}
//truyện hot
export async function fetchHotStories(top = 10) {
  try {
    const response = await fetch(`${API_URL}api/Stories/hot?top=${top}`);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch hot stories: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    // Handle both {storys: [...]} and direct array response formats
    const stories = data.storys || data;

    // Sort by total views in descending order
    return stories.sort(
      (a, b) =>
        (b.totalViews || b.total_views || 0) -
        (a.totalViews || a.total_views || 0)
    );
  } catch (error) {
    console.error("Error fetching hot stories:", error);
    throw error;
  }
}

// fetch danh sách latest chapters
export async function fetchLatestChapters(top = 10) {
  const response = await fetch(
    `${API_URL}api/Chapter/latestChapters?top=${top}`
  );
  if (!response.ok) {
    throw new Error(
      `Failed to fetch latest chapters: ${response.status} ${response.statusText}`
    );
  }

  const { latestChapters } = await response.json();
  return latestChapters;
}

//truyện đã hoàn thành
export async function fetchCompletedStories() {
  const response = await fetch(`${API_URL}api/Stories/completed`);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch completed stories: ${response.status} ${response.statusText}`
    );
  }
  // API trả về trực tiếp một mảng CompletedStoryDto[]
  const completedStories = await response.json();
  return completedStories;
}

export async function fetchStories(title = "") {
  const query = title ? `?title=${encodeURIComponent(title)}` : "";
  const response = await fetch(`${API_URL}api/Stories${query}`);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch stories: ${response.status} ${response.statusText}`
    );
  }

  const { stories } = await response.json();
  return stories;
}

//ratings
export async function fetchRatings(storyId) {
  const url = `${API_URL}api/stories/${storyId}/ratings`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch ratings for story "${storyId}": ${response.status} ${response.statusText}`
    );
  }
  // API trả về mảng JSON trực tiếp
  const ratings = await response.json();
  return ratings;
}
//gửi rating lên be
export async function postRating(storyId, score, review) {
  const url = `${API_URL}api/stories/${storyId}/ratings`;
  const token = localStorage.getItem("accessToken"); // hoặc từ chỗ bạn lưu

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ storyId, score, review }),
  });

  const text = await res.text(); // đọc luôn text để debug
  console.log("postRating response:", res.status, text);

  if (!res.ok) {
    throw new Error(`Post rating failed: ${res.status}`);
  }
  return JSON.parse(text);
}

//comment
export async function fetchComments(storyId) {
  const url = `${API_URL}api/Comment/story/${encodeURIComponent(storyId)}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(
      `Failed to fetch comments for "${storyId}": ${res.status} ${res.statusText}`
    );
  }
  return await res.json();
}

// storyServices.js

export async function postComment(
  storyId,
  content,
  chapterId = null,
  parentCommentId = null
) {
  const token = localStorage.getItem("accessToken");
  const payload = {
    storyId,
    content,
    chapterId: chapterId != null ? String(chapterId) : null,
    parentCommentId: parentCommentId != null ? String(parentCommentId) : null,
  };
  const res = await fetch(`${API_URL}api/Comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to post comment: ${res.status} – ${text}`);
  }
  return await res.json();
}

//lay chi tiet
export async function fetchStoryById(id) {
  const response = await fetch(`${API_URL}api/Stories/${id}`);
  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error(
      `Failed to fetch story ${id}: ${response.status} ${response.statusText}`
    );
  }

  return await response.json();
}

//tao truyen moi
export async function createStory(storyData) {
  const response = await fetch(`${API_URL}api/Stories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(storyData),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to create story: ${response.status} ${response.statusText}`
    );
  }

  const { story } = await response.json();
  return story;
}

//add for id
export async function updateStory(id, storyData) {
  const response = await fetch(`${API_URL}api/Stories/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(storyData),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to update story ${id}: ${response.status} ${response.statusText}`
    );
  }

  const { story } = await response.json();
  return story;
}

//delete
export async function deleteStory(id) {
  const response = await fetch(`${API_URL}api/Stories/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(
      `Failed to delete story ${id}: ${response.status} ${response.statusText}`
    );
  }
}

//category
export async function fetchStoriesByCategory(category) {
  const stories = await fetchStories();
  return stories.filter(
    (story) =>
      story.categories &&
      story.categories.some((c) => c.toLowerCase() === category.toLowerCase())
  );
}

//tag
export async function fetchStoriesByTag(tag) {
  const stories = await fetchStories();
  return stories.filter(
    (story) =>
      story.tags &&
      story.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
  );
}

export async function fetchChaptersByStoryId(storyId) {
  try {
    const response = await fetch(`${API_URL}chapter/${storyId}`);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch chapters: ${response.status} ${response.statusText}`
      );
    }
    const data = await response.json();
    return data.chapters || [];
  } catch (error) {
    console.error(`Error fetching chapters for story ${storyId}:`, error);
    throw error;
  }
}
