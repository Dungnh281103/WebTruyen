import React from 'react';
import StoryCard from '../../../../components/StoryCard';
import SectionTitle from '../../../../components/SectionTitle';
import './HotStory.scss';

function HotStory({ stories }) {
  // Limit to maximum 5 stories
  const limitedStories = stories.slice(0, 5);

  return (
    <section className="section section--hot-stories">
      <SectionTitle title=" Truyện Hot" viewAllLink="/xep-hang/hot" />
      <div className="hot-stories-grid">
        {limitedStories.map(story => (
          <StoryCard key={story.id} story={story} />
        ))}
      </div>
    </section>
  );
}

export default HotStory;