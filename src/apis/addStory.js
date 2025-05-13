import { fetchWithAuth } from "./apiClient"; // hoặc fetch + Bearer token

export interface StoryCreatePayload {
  title: string;
  author?: string;
  translator?: string;
  coverUrl?: string;
  description?: string;
  status: string;
  isRecommended: boolean;
  categoryIds?: number[];
  tagIds?: number[];
}

export async function createStory(payload: StoryCreatePayload) {
  const res = await fetchWithAuth("stories", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Không thể tạo truyện mới");
  return await res.json(); // { story: StoryResponseDto }
}
