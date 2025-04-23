import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './StoryDetailPage.scss';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import SectionTitle from '../../components/SectionTitle/SectionTitle';
import CommentSection from './CommentSection/CommentSection';
import StatusBadge from './StatusBadge/StatusBadge';
import { CiBookmark, CiStar } from "react-icons/ci";
import { RxHamburgerMenu } from "react-icons/rx";
import { VscComment } from "react-icons/vsc";
import { IoBookOutline } from "react-icons/io5";

function StoryDetailPage() {
    const { storyId } = useParams();
    const navigate = useNavigate();
    const [story, setStory] = useState(null);
    const [sameAuthorStories, setSameAuthorStories] = useState([]);
    const [chapters, setChapters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        window.scrollTo(0, 0);
        fetchStoryData();
    }, [storyId]);
    
    const fetchStoryData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Fetch data from stories.json
            const response = await fetch('/data/stories.json');
            if (!response.ok) {
                throw new Error('Failed to fetch story data');
            }
            
            const data = await response.json();
            
            // Find the story by ID
            const storyData = data.storys.find(s => s.id === storyId);
            if (!storyData) {
                throw new Error(`Story with ID ${storyId} not found`);
            }
            
            setStory(storyData);
            
            // Find other stories by the same author
            const authorStories = data.storys
                .filter(s => s.author === storyData.author && s.id !== storyId)
                .slice(0, 5);
            setSameAuthorStories(authorStories);
            
            // Get chapters for this story and sort them by number
            const storyChapters = data.chapters
                ? data.chapters
                    .filter(c => c.story_id === storyId)
                    .sort((a, b) => a.number - b.number)
                : [];
                
            // Add timeAgo to each chapter
            const chaptersWithTimeAgo = storyChapters.map(chapter => {
                return {
                    ...chapter,
                    timeAgo: chapter.created_at ? formatTimeAgo(new Date(chapter.created_at)) : 'N/A'
                };
            });
            
            setChapters(chaptersWithTimeAgo);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching story:', error);
            setError(error.message);
            setLoading(false);
        }
    };
    
    // Format timeAgo for chapters
    const formatTimeAgo = (date) => {
        const now = new Date();
        const diffMs = now - date;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        
        if (diffDays > 30) {
            const diffMonths = Math.floor(diffDays / 30);
            return `${diffMonths} tháng trước`;
        } else if (diffDays > 0) {
            return `${diffDays} ngày trước`;
        } else {
            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
            if (diffHours > 0) {
                return `${diffHours} giờ trước`;
            } else {
                const diffMinutes = Math.floor(diffMs / (1000 * 60));
                return diffMinutes > 0 ? `${diffMinutes} phút trước` : 'Vừa xong';
            }
        }
    };
    
    // Function to determine if chapter has been read
    const isChapterRead = (chapterId) => {
        try {
            const readingHistory = JSON.parse(localStorage.getItem('readingHistory')) || [];
            return readingHistory.some(item => 
                item.storyId === storyId && item.lastChapterId === chapterId
            );
        } catch (e) {
            return false;
        }
    };
    
    if (loading) {
        return (
            <div className="story-detail-page loading">
                <Header />
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Đang tải thông tin truyện...</p>
                </div>
                <Footer />
            </div>
        );
    }
    
    if (error || !story) {
        return (
            <div className="story-detail-page error">
                <Header />
                <div className="error-container">
                    <h2>Không thể tải thông tin truyện</h2>
                    <p>{error || 'Đã xảy ra lỗi không xác định'}</p>
                    <button onClick={fetchStoryData} className="retry-button">Thử lại</button>
                </div>
                <Footer />
            </div>
        );
    }
    
    // Get first chapter ID for "Read Story" button
    const firstChapterId = chapters.length > 0 ? chapters[0].id : null;
    
    // Format the description
    const formattedDescription = Array.isArray(story.description) 
        ? story.description.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
        ))
        : <p>{story.description}</p>;
    
    return (
        <div className="story-detail-page">
            <Header />
            
            <div className="banner">
                <img 
                    src="https://static.cdnno.com/storage/topbox/f0e089d0cfb572cec383725c5572f854.webp" 
                    alt="Banner" 
                    className="banner-image"
                />
            </div>
            
            <div className="content-container">
                <div className="story-info">
                    <div className="cover-container">
                        <img 
                            src={story.cover_url || '/images/placeholder-cover.jpg'} 
                            alt={story.title} 
                            className="cover-image" 
                        />
                        <StatusBadge status={story.status} />
                    </div>
                    
                    <div className="info-text">
                        <h2 className="story-title">{story.title}</h2>
                        <div className="author-name">
                            <Link to={`/author/${encodeURIComponent(story.author)}`}>
                                {story.author}
                            </Link>
                        </div>

                        <div className="info-stats">
                            <div className="stat">
                                <div className="stat-value">{story.total_views?.toLocaleString() || 0}</div>
                                <div className="stat-label">Lượt đọc</div>
                            </div>
                            <div className="stat">
                                <div className="stat-value">{story.rating?.average || 0}</div>
                                <div className="stat-label">Đánh giá ({story.rating?.count?.toLocaleString() || 0})</div>
                            </div>
                            <div className="stat">
                                <div className="stat-value">{story.bookmarks_count?.toLocaleString() || 0}</div>
                                <div className="stat-label">Cất giữ</div>
                            </div>
                        </div>
                        
                        <div className="categories-tags-container">
                            {story.categories && story.categories.map((category, index) => (
                                <Link to={`/category/${category}`} key={`category-${index}`}>
                                    <span className="category-tag">{category}</span>
                                </Link>
                            ))}
                            {story.tags && story.tags.map((tag, index) => (
                                <Link to={`/tag/${tag}`} key={`tag-${index}`}>
                                    <span className="tag">{tag}</span>
                                </Link>
                            ))}
                        </div>

                        <div className="info-actions">
                            {firstChapterId ? (
                                <Link to={`/story/${storyId}/chapter/${firstChapterId}`} className="btn1-primary">
                                    <IoBookOutline className="icon" />
                                    <span>Đọc Truyện</span>
                                </Link>
                            ) : (
                                <button className="btn-primary disabled" disabled>
                                    <IoBookOutline className="icon" />
                                    <span>Chưa có chương</span>
                                </button>
                            )}
                            <button className="btn-secondary">
                                <CiBookmark className="icon" />
                                <span>Đánh dấu</span>
                            </button>
                            <button 
                                className="btn-secondary"
                                onClick={() => document.querySelector('.chapter-list').scrollIntoView({ behavior: 'smooth' })}
                            >
                                <RxHamburgerMenu className="icon" />
                                <span>Mục lục</span>
                            </button>
                            <button 
                                className="btn-secondary"
                                onClick={() => document.querySelector('.comment-section').scrollIntoView({ behavior: 'smooth' })}
                            >
                                <CiStar className="icon" />
                                <span>Đánh giá</span>
                            </button>
                            <button 
                                className="btn-secondary"
                                onClick={() => document.querySelector('.comment-section').scrollIntoView({ behavior: 'smooth' })}
                            >
                                <VscComment className="icon" />
                                <span>Thảo luận</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="story-sections">
                    {chapters.length > 0 && (
                        <section className="chapter-list section-card">
                            <SectionTitle 
                                title="Danh sách chương" 
                                viewAllLink={`/story/${storyId}/chapters`} 
                            />
                            <div className="chapters-grid">
                                {chapters.slice(0, 10).map((chapter) => (
                                    <Link 
                                        to={`/story/${storyId}/chapter/${chapter.id}`}
                                        key={chapter.id} 
                                        className="chapter-item"
                                    >
                                        <div className="chapter-header">
                                            <h3 className="chapter-title">Chương {chapter.number}: {chapter.title}</h3>
                                        </div>
                                        <div className="chapter-footer">
                                            <span className="chapter-time">{chapter.timeAgo}</span>
                                            {isChapterRead(chapter.id) && <span className="chapter-read-status"></span>}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}

                    <section className="introduction section-card">
                        <SectionTitle title="Giới thiệu" />
                        <div className="description-content">
                            {formattedDescription}
                        </div>
                    </section>
                    
                    {sameAuthorStories.length > 0 && (
                        <section className="same-author section-card">
                            <SectionTitle 
                                title="Cùng tác giả" 
                                viewAllLink={`/author/${encodeURIComponent(story.author)}`} 
                            />
                            <div className="related-stories-grid">
                                {sameAuthorStories.map(relatedStory => (
                                    <Link 
                                        to={`/story/${relatedStory.id}`} 
                                        key={relatedStory.id} 
                                        className="related-story-card"
                                    >
                                        <div className="related-story-cover">
                                            <img src={relatedStory.cover_url || '/images/placeholder-cover.jpg'} alt={relatedStory.title} />
                                        </div>
                                        <h3 className="related-story-title">{relatedStory.title}</h3>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}

                    <CommentSection storyId={storyId} />
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default StoryDetailPage;