import React, { useState, useEffect } from 'react';
import { fetchFeaturedStories } from '../../../../utils/dataService'; // Adjust the import path as necessary
import StoryCard from '../../../../components/StoryCard';
import SectionTitle from '../../../../components/SectionTitle/SectionTitle';
import './HotStory.scss';

function HotStory() {
  const [story, setStory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHotStory = async () => {
      setLoading(true);
      try {
        const featuredData = await fetchFeaturedStories();
        // Get hot story from the featured data
        const hotStory = featuredData.hot || [];
        // Limit to maximum 5 story
        setStory(hotStory.slice(0, 5));
      } catch (error) {
        console.error('Failed to load hot story:', error);
      } finally {
        setLoading(false);
      }
    };

    loadHotStory();
  }, []);

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  if (!story.length) {
    return null;
  }

  return (
    <section className="section section--hot-story">
      <SectionTitle title="Truyện Hot" viewAllLink="/xep-hang/hot" />
      <div className="hot-story-grid">
        {story.map(story => (
          <StoryCard key={story.id} story={story} />
        ))}
      </div>
    </section>
  );
}

export default HotStory;