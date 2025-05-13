import React, { useState, useEffect } from "react";
import { fetchHotStories } from "../../../../apis/storyServices";
import StoryCard from "../../../../components/StoryCard";
import SectionTitle from "../../../../components/SectionTitle/SectionTitle";
import "./HotStory.scss";

function HotStory() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHotStories = async () => {
      setLoading(true);
      try {
        const hotStories = await fetchHotStories(5);
        setStories(hotStories);
      } catch (error) {
        console.error("Failed to load hot stories:", error);
      } finally {
        setLoading(false);
      }
    };

    loadHotStories();
  }, []);

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  if (!stories.length) {
    return null;
  }

  return (
    <section className="section section--hot-story">
      <SectionTitle title="Truyện Hot" viewAllLink="/xep-hang/hot" />
      <div className="hot-story-grid">
        {stories.map((story) => (
          <StoryCard key={story.id} story={story} />
        ))}
      </div>
    </section>
  );
}

export default HotStory;
