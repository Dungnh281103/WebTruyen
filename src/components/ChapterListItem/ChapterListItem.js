

import React from 'react';
import { Link } from 'react-router-dom';

function ChapterListItem({ chapter, isRead }) {
    return (
        <div className="chapter-list-item">
            <Link to={chapter.url}>
                {chapter.title} {isRead && '(Đã đọc)'}
            </Link>
        </div>
    );
}

export default ChapterListItem;