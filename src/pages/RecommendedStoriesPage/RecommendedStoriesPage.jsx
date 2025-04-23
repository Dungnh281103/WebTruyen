import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DetailedStoryItem from '../HomePage/components/DetailedStoryItem/DetailedStoryItem';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import Pagination from '../../components/Pagination/Pagination';
import { FaFilter } from 'react-icons/fa'; // Import filter icon
import { useNavigate } from 'react-router-dom';
import './RecommendedStoriesPage.scss';

function RecommendedStoriesPage() {
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [storiesPerPage] = useState(20); // Number of stories per page
  const navigate = useNavigate();

 

  useEffect(() => {
    const fetchRecommendedStories = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/data/stories.json');
        if (!response.ok) {
          throw new Error('Không thể tải dữ liệu truyện');
        }

        const data = await response.json();
        // Filter recommended stories
        const recommendedStories = data.storys.filter(story => story.isRecommended);
        setStories(recommendedStories);
      } catch (err) {
        console.error('Error fetching recommended stories:', err);
        setError('Không thể tải danh sách truyện đề cử. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendedStories();
  }, []);

  // Get current stories for pagination
  const indexOfLastStory = currentPage * storiesPerPage;
  const indexOfFirstStory = indexOfLastStory - storiesPerPage;
  const currentStories = stories.slice(indexOfFirstStory, indexOfLastStory);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const goToFilterPage = () => {
    navigate('/filter');
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="loading-indicator">Đang tải danh sách truyện đề cử...</div>
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

  return (
    <div className="recommended-stories-page">
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
          <h1>Truyện Đề Cử</h1>
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
            <p>Không có truyện đề cử nào.</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default RecommendedStoriesPage;