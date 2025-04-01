import React from 'react';
import { useParams } from 'react-router-dom';
import './StoryDetailPage.scss'; // Import file SCSS
import ChapterListItem from '../../components/ChapterListItem/ChapterListItem';
import RatingStars from './RatingStars/RatingStars';
import CommentSection from './CommentSection/CommentSection';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { Link } from 'react-router-dom';
import { CiBookmark, CiStar } from "react-icons/ci";
import { RxHamburgerMenu } from "react-icons/rx";
import { VscComment } from "react-icons/vsc";
import { IoBookOutline } from "react-icons/io5";
import { HiChevronDoubleRight } from "react-icons/hi";



function StoryDetailPage() {
    // Giả định bạn có hàm lấy dữ liệu truyện từ API dựa trên id truyện
    // Ví dụ: const story = useFetchStory(storyId);
    const { storyId } = useParams();
    const story = getStoryDetails(storyId); // Hàm giả định để lấy dữ liệu truyện

    // Dữ liệu giả lập
    // const isLoggedIn = true; // Giả lập trạng thái đăng nhập
    const isChapterRead = (chapterId) => false; // Logic kiểm tra chương đã đọc (nếu có)

    if (!story) {
        return <div>Đang tải chi tiết truyện...</div>;
    }

    return (
        <div className="story-detail-page">
            <Header />
            <div className="banner-placeholder">
                <img src="https://static.cdnno.com/storage/topbox/f0e089d0cfb572cec383725c5572f854.webp" alt="Banner" />
                
            </div>
            <div className="story-info">
                <div className="cover-container">
                    <img src={story?.coverImage} alt={story?.title} className="cover-image" />
                </div>
                <div className="info-text">
                    <h1>{story.title}</h1>
                    <div className='text-author'>{story.author}</div>

                    <div className="info-actions">
                        <div className='read-story'>
                            <button className="btn-read-story">
                            <Link to={`/truyen/${storyId}/${story.chapters[0].id}`} className="btn-read-story">
                                <IoBookOutline className='icon-fa' />
                                <span>Đọc Truyện</span>
                            </Link>
                                
                            </button>
                        </div>
                        <button className="btn">
                            
                            <CiBookmark className='icon-fa' />
                            <span>Đánh dấu</span>
                        </button>
                        <button className="btn">
                            <RxHamburgerMenu className='icon-fa' />
                            <span>Mục lục</span>
                        </button>
                        <button className="btn">
                            <CiStar className='icon-fa' />
                            <span>Đánh giá</span>
                        </button>
                        <button className="btn">
                            <VscComment className='icon-fa' />
                            <span>Thảo luận</span>
                        </button>
                    </div>

                    <div className="info-stats">
                        <div className="stat">
                            <div className="stat-label">Lượt đọc</div>
                            <div className="stat-value">{story.views}</div>
                        </div>
                        <div className="stat">
                            <div className="stat-label">Đề cử</div>
                            <div className="stat-value">{story.favorites}</div>
                        </div>
                        <div className="stat">
                            <div className="stat-label">Cất giữ</div>
                            <div className="stat-value">533</div> {/* Giả định */}
                        </div>
                    </div>
                    <div className='rating-container'>
                        <RatingStars rating={story.rating}/>
                    </div>
                    <div className='categories-tags-container'>
                        <div className="tag-buttons-row">
                            {story.categories.map((category, index) => (
                            <Link to={`/category/${category}`} key={`category-${index}`}>
                                <button className='tag-button'>{category}</button>
                            </Link>
                        ))}
                            {story.tags.map((tag, index) => (
                            <Link to={`/tag/${tag}`} key={`tag-${index}`}>
                                <button className='tag-button'>{tag}</button>
                            </Link>
        ))}
    </div>
</div>
                    
                    <p>Tình trạng: {story.status}</p>
                    
                    {/* {isLoggedIn && <button className="add-library-btn">Thêm vào tủ truyện</button>} */}
                </div>
            </div>

            <div className="chapter-list">
                <div className="list-header">
                    <h2>DANH SÁCH CHƯƠNG</h2>
                    <button className='header-action'>
                        <span className='header-action-text'>Xem tất cả</span>
                        <HiChevronDoubleRight className='header-action-icon' />
                    </button>
                </div>
                <div className="chapters-container">
                    {story.chapters.map((chapter) => (
                    <div className="chapter-item-wrapper" key={chapter.id}>
                        <ChapterListItem chapter={chapter} isRead={isChapterRead(chapter.id)} />
                    </div>
                ))}
                </div>
            </div>

            <div className="introduction">
                <div className='list-header'>
                        <h2>GIỚI THIỆU</h2>
                </div>
                <p>{story.introduction}</p>
                <p>
                "Sư phụ, rõ ràng Ma môn cao thủ xuất hiện lớp lớp, so tu sĩ chính đạo mạnh hơn rất nhiều, vì sao đều là Ma môn b·ị đ·ánh đến không ngẩng nổi đầu?"

                "Bởi vì tu sĩ chính đạo địch nhân chỉ có Ma môn, mà Ma môn địch nhân bao gồm người bên cạnh. Ma tu luôn không khả năng như chính đạo dạng kia đồng tâm hiệp lực, mười tám Ma Tôn, mười ba c·ái c·hết bởi người trong ma đạo trong tay."

                "Đồ nhi minh bạch, muốn để ma đạo hưng thịnh, đầu tiên muốn thống nhất Ma môn, cấm tiệt nội đấu a."

                "Ngươi minh bạch cái rắm, cái kia ma đạo chẳng phải biến thành chính đạo?"

                ...

                Nhiều năm sau đó, Trần Nghiệp cuối cùng minh bạch ý của sư phụ, làm ma tu thành người đứng đầu chính đạo, cái kia ma đạo liền là chính đạo.
                </p>
                
            </div>
            <div className='introduction'>
                <div className='list-header'>
                    <h2>Cùng tác giả</h2>
                </div>
                <div>
                    <p>Đấu Phá Thương Khung</p>
                </div>
            </div>

            <CommentSection />
            <Footer />
            
        </div>
    );
}

// Hàm giả định lấy dữ liệu truyện từ API
function getStoryDetails(storyId) {
    // Thay thế bằng logic fetch dữ liệu từ API dựa trên storyId
    // Ví dụ: return fetch(`/api/stories/${storyId}`).then(response => response.json());
    // Dữ liệu giả định
    return {
        id: storyId,
        title: 'Đấu Phá Thương Khung',
        coverImage: 'https://static.cdnno.com/poster/cac-nguoi-tu-tien-ta-lam-ruong/300.jpg',
        author: 'Thiên Tằm Thổ Đậu',
        introduction: 'Lý Huyền xuyên qua Võ Đạo vi tôn, thể chất là vua Thiên Huyền Đại Lục, bị mỹ nữ sư tôn thu làm đồ đệ, vốn cho rằng hội đi đến một đầu ầm ầm sóng dậy con đường Võ Đạo, không nghĩ tới bị kiểm tra đo lường ra trời sinh phàm thể, tu hành cả một đời cũng khó có thành tựu.',

        categories: ['Tiên hiệp', 'Huyền huyễn', 'Xuyên không'],
        tags: ['Tu luyện', 'Phiêu lưu'],
        status: 'Hoàn thành',
        rating: 4.5,
        views: 12345,
        favorites: 5678,
        chapters: [
            { id: 1, title: 'Chương 1: Mất đi đấu khí', url: '/dau-pha-thuong-khung/1' },
            { id: 2, title: 'Chương 2: Thắng muốn thắng đến xinh đẹp (2)', url: '/dau-pha-thuong-khung/2' },
            { id: 3, title: 'Chương 3: Nhẫn linh hồn', url: '/dau-pha-thuong-khung/3' },
            // ... thêm các chương khác
        ],
    };
}

export default StoryDetailPage;