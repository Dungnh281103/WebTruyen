import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import DetailedStoryItem from '../HomePage/components/DetailedStoryItem/DetailedStoryItem';
import Pagination from '../../components/Pagination/Pagination';
import { FaFilter } from 'react-icons/fa';
import { fetchStories } from '../../apis/storyServices';
import './TagStoriesPage.scss';

function TagStoriesPage() {
  const { tagName } = useParams();
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [storiesPerPage] = useState(20);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchStoriesByTag();
  }, [tagName]);

  const fetchStoriesByTag = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Get all stories
      const allStories = await fetchStories();
      
      // Filter stories by tag
      const filteredStories = allStories.filter(story => 
        story.tags && story.tags.some(tag => 
          tag.toLowerCase() === decodeURIComponent(tagName).toLowerCase()
        )
      );
      
      setStories(filteredStories);
    } catch (err) {
      console.error('Error fetching stories by tag:', err);
      setError('Không thể tải danh sách truyện. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  // Get current stories for pagination
  const indexOfLastStory = currentPage * storiesPerPage;
  const indexOfFirstStory = indexOfLastStory - storiesPerPage;
  const currentStories = stories.slice(indexOfFirstStory, indexOfLastStory);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // Navigate to filter page
  const goToFilterPage = () => {
    navigate('/filter');
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="loading-indicator">Đang tải danh sách truyện...</div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="error-message">{error}</div>
        <Footer />
      </>
    );
  }

  const decodedTagName = decodeURIComponent(tagName);

  return (
    <div className="tag-stories-page">
      <Header />
      <div className="banner">
        <img 
          src="https://static.cdnno.com/storage/topbox/f0e089d0cfb572cec383725c5572f854.webp" 
          alt="Banner" 
          className="banner-image"
        />
      </div>
      <div className="container">
        <div className="page-header">
          <h1>Truyện với thẻ: <span className="highlighted-tag">{decodedTagName}</span></h1>
          <button className="filter-button" onClick={goToFilterPage}>
            <FaFilter className="filter-icon" /> Lọc Truyện
          </button>
        </div>

        {stories.length > 0 ? (
          <>
            <div className="stories-grid">
              {currentStories.map(story => (
                <DetailedStoryItem key={story.id} story={story} />
              ))}
            </div>
            
            <Pagination 
              itemsPerPage={storiesPerPage} 
              totalItems={stories.length} 
              currentPage={currentPage}
              paginate={paginate} 
            />
          </>
        ) : (
          <div className="no-stories">
            <p>Không tìm thấy truyện nào với thẻ "{decodedTagName}".</p>
            <Link to="/" className="home-link">Quay lại trang chủ</Link>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default TagStoriesPage;