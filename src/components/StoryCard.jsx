import React from 'react';
import { Link } from 'react-router-dom';

function StoryCard({ story }) {
  return (
    <Link to={story.url || '#'} style={{ textDecoration: 'none', color: 'inherit', border: '1px solid #ddd', display: 'block', borderRadius: '4px', overflow: 'hidden' }}>
      <img src={story.imageUrl || '/images/placeholder.png'} alt={story.title} style={{ width: '100%', height: '150px', objectFit: 'cover', display: 'block' }} />
      <div style={{ padding: '8px' }}>
        <h4 style={{ margin: '0 0 5px 0', fontSize: '1em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{story.title}</h4>
        {/* Thêm các thông tin khác nếu cần (chương mới, lượt xem...) */}
        {story.latestChapter && <p style={{ margin: 0, fontSize: '0.9em', color: 'grey' }}>{story.latestChapter}</p>}
        {story.views && <p style={{ margin: 0, fontSize: '0.9em', color: 'grey' }}>Views: {story.views}</p>}
        {story.status && <p style={{ margin: 0, fontSize: '0.9em', color: 'green' }}>{story.status}</p>}
      </div>
    </Link>
  );
}
export default StoryCard;