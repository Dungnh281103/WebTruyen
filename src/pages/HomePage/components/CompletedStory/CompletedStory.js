import React from 'react';
import StoryCard from '../../../../components/StoryCard';
import SectionTitle from '../../../../components/SectionTitle';
import './CompletedStory.scss';

function CompletedStory({ stories }) {
  // Limit to maximum 5 stories
  const limitedStories = stories.slice(0, 5);

  return (
    <section className="section section--completed-stories">
      <SectionTitle title=" Truyện Đã Hoàn Thành" viewAllLink="/truyen-hoan-thanh" />
      <div className="completed-stories-grid">
        {limitedStories.map(story => (
          <StoryCard key={story.id} story={story} />
        ))}
      </div>
    </section>
  );
}

export default CompletedStory;