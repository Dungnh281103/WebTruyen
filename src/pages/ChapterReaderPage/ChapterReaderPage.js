import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ChapterReaderPage.scss';
import CommentSection from '../StoryDetailPage/CommentSection/CommentSection';
import { FaArrowLeft, FaArrowRight, FaList, FaCog, FaFlag, FaTimes } from 'react-icons/fa';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

function ChapterReaderPage() {
    const { storyId, chapterId } = useParams();
    const [chapterContent, setChapterContent] = useState('');
    const [storyTitle, setStoryTitle] = useState('');
    const [chapterTitle, setChapterTitle] = useState('');
    const [chapterData, setChapterData] = useState(null);
    const [showSettings, setShowSettings] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    // Cấu hình đọc truyện mặc định
    const defaultSettings = {
        backgroundColor: "#eae4d3",
        textColor: "#333333",
        fontSize: 16,
        fontFamily: "Arial, sans-serif",
        lineHeight: 1.6,
        textAlign: "left"
    };

    // State cho cấu hình đọc
    const [readerSettings, setReaderSettings] = useState(() => {
        // Lấy cấu hình từ localStorage nếu có, nếu không thì dùng mặc định
        const savedSettings = localStorage.getItem('readerSettings');
        return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
    });

    // Effect để áp dụng cấu hình đọc vào trang
    useEffect(() => {
        // Lưu cấu hình vào localStorage
        localStorage.setItem('readerSettings', JSON.stringify(readerSettings));
        
        // Áp dụng màu nền
        document.body.style.backgroundColor = readerSettings.backgroundColor;
        
        // Clean up function để reset màu nền khi component unmounts
        return () => {
            document.body.style.backgroundColor = '';
        };
    }, [readerSettings]);

    useEffect(() => {
        // Scroll to top when chapter changes
        window.scrollTo(0, 0);
        fetchChapterData(storyId, chapterId);
    }, [storyId, chapterId]);

    const fetchChapterData = async (storyId, chapterId) => {
        setIsLoading(true);
        try {
            // Fetch the stories.json file
            const response = await fetch('/data/stories.json');
            if (!response.ok) {
                throw new Error('Failed to fetch stories data');
            }
            
            const data = await response.json();
            
            // Find the story by ID
            const story = data.storys.find(s => s.id === storyId);
            if (!story) {
                throw new Error(`Story with ID ${storyId} not found`);
            }
            
            // Find the chapter data from chapters array
            const chapter = data.chapters.find(
                c => c.story_id === storyId && c.id === chapterId
            );
            
            if (!chapter) {
                throw new Error(`Chapter with ID ${chapterId} not found for story ${storyId}`);
            }
            
            // Format chapter content with line breaks after each period
            let formattedContent = '';
            
            // Helper function to add line breaks after periods
            const formatSentences = (text) => {
                // Replace periods followed by a space with period + line break
                // But exclude common abbreviations like Mr. Dr. etc.
                return text
                    .replace(/(?<!\b(?:Mr|Mrs|Dr|Prof|vv))\.\s+/g, '.<br><br>')  // Add double line break after periods
                    .replace(/\!\s+/g, '!<br><br>')  // Also handle exclamation marks
                    .replace(/\?\s+/g, '?<br><br>');  // Also handle question marks
            };
            
            if (Array.isArray(chapter.content)) {
                // If content is an array of paragraphs
                formattedContent = chapter.content.map(paragraph => {
                    const formattedParagraph = formatSentences(paragraph);
                    return `<p>${formattedParagraph}</p>`;
                }).join('');
            } else if (typeof chapter.content === 'string') {
                // If content is already HTML or a simple string
                if (chapter.content.includes('<p>')) {
                    // This is already HTML, so we need to preserve the tags
                    // This is a simplistic approach - more complex HTML might need a parser
                    const parts = chapter.content.split(/(<p>.*?<\/p>)/g);
                    formattedContent = parts.map(part => {
                        if (part.startsWith('<p>') && part.endsWith('</p>')) {
                            // Extract the content between <p> tags
                            const innerContent = part.substring(3, part.length - 4);
                            const formattedInner = formatSentences(innerContent);
                            return `<p>${formattedInner}</p>`;
                        }
                        return part; // Return unchanged if not a <p> tag
                    }).join('');
                } else {
                    // Simple string, not HTML
                    const formattedText = formatSentences(chapter.content);
                    formattedContent = `<p>${formattedText}</p>`;
                }
            } else {
                formattedContent = '<p>Không có nội dung cho chương này.</p>';
            }
            
            // Set the data
            setStoryTitle(story.title);
            setChapterTitle(`Chương ${chapter.chapter_number}: ${chapter.title}`);
            setChapterContent(formattedContent);
            
            // Find next and previous chapters
            const chaptersForStory = data.chapters
                .filter(c => c.story_id === storyId)
                .sort((a, b) => a.number - b.number);
            
            const currentIndex = chaptersForStory.findIndex(c => c.id === chapterId);
            const nextChapter = currentIndex < chaptersForStory.length - 1 ? chaptersForStory[currentIndex + 1] : null;
            const prevChapter = currentIndex > 0 ? chaptersForStory[currentIndex - 1] : null;
            
            setChapterData({
                ...chapter,
                story: story,
                nextChapterId: nextChapter?.id || null,
                prevChapterId: prevChapter?.id || null,
                currentIndex: currentIndex + 1,
                totalChapters: chaptersForStory.length
            });
            
            // Update reading history
            updateReadingHistory(
                storyId, 
                chapterId, 
                story.title, 
                chapter.title, 
                chapter.number, 
                story.cover_url
            );
            
            setIsLoading(false);
            document.title = `${chapter.number}: ${chapter.title} - ${story.title}`;
        } catch (error) {
            console.error("Failed to fetch chapter:", error);
            setChapterContent("<p>Không thể tải nội dung chương. Vui lòng thử lại sau.</p>");
            setIsLoading(false);
        }
    };

    const updateReadingHistory = (storyId, chapterId, storyTitle, chapterTitle, chapterNumber, coverUrl) => {
        try {
            // Get current reading history from localStorage
            const readingHistoryStr = localStorage.getItem('readingHistory');
            const readingHistory = readingHistoryStr ? JSON.parse(readingHistoryStr) : [];
            
            // Update or add the current reading item
            const existingIndex = readingHistory.findIndex(h => h.storyId === storyId);
            const readingItem = {
                storyId,
                storyTitle,
                lastChapterId: chapterId,
                lastChapterTitle: chapterTitle,
                lastChapterNumber: chapterNumber,
                coverUrl: coverUrl || null,
                timestamp: new Date().toISOString()
            };
            
            if (existingIndex >= 0) {
                // Update existing entry
                readingHistory[existingIndex] = readingItem;
            } else {
                // Add new entry, limit to 20 entries
                readingHistory.unshift(readingItem);
                if (readingHistory.length > 20) {
                    readingHistory.pop();
                }
            }
            
            // Save back to localStorage
            localStorage.setItem('readingHistory', JSON.stringify(readingHistory));
        } catch (error) {
            console.error('Error updating reading history:', error);
        }
    };

    // Navigation functions
    const navigateToPreviousChapter = () => {
        if (chapterData && chapterData.prevChapterId) {
            navigate(`/story/${storyId}/chapter/${chapterData.prevChapterId}`);
        }
    };

    const navigateToNextChapter = () => {
        if (chapterData && chapterData.nextChapterId) {
            navigate(`/story/${storyId}/chapter/${chapterData.nextChapterId}`);
        }
    };

    const navigateToChapterList = () => {
        navigate(`/story/${storyId}`);
    };

    // Hàm xử lý thay đổi cấu hình đọc
    const handleSettingChange = (setting, value) => {
        setReaderSettings(prev => ({
            ...prev,
            [setting]: value
        }));
    };

    // Hàm reset cấu hình về mặc định
    const resetSettings = () => {
        setReaderSettings(defaultSettings);
    };

    // Toggle hiển thị bảng cấu hình
    const toggleSettings = () => {
        setShowSettings(prev => !prev);
    };
    
    // Danh sách font chữ
    const fontOptions = [
        "Arial, sans-serif",
        "Times New Roman, serif",
        "Verdana, sans-serif",
        "Georgia, serif",
        "Tahoma, sans-serif",
        "Roboto, sans-serif"
    ];

    // Danh sách các lựa chọn canh chữ
    const alignOptions = [
        {value: "left", label: "Trái"},
        {value: "center", label: "Giữa"},
        {value: "right", label: "Phải"},
        {value: "justify", label: "Đều hai bên"}
    ];
    
    return (
        <div className="chapter-reader-page">
        <Header/>

            {/* --- Banner --- */}
            <div className="banner-placeholder">
                <img src="https://static.cdnno.com/storage/topbox/f0e089d0cfb572cec383725c5572f854.webp" alt="Banner" />
            </div>
            <div className="reader-header">
                <h2>{storyTitle}</h2>
                <h3>{chapterTitle}</h3>
       
                {chapterData && (
                    <div className="text-center mb-3 text-muted">
                        <small>Chương {chapterData.currentIndex}/{chapterData.totalChapters}</small>
                    </div>
                )}
                <div className="reader-actions">
                    <button 
                        className="btn-reader btn-secondary"
                        onClick={navigateToPreviousChapter}
                        disabled={!chapterData || !chapterData.prevChapterId}
                    >
                        <FaArrowLeft className="mr-1" /> Chương trước
                    </button>
                    <button 
                        className="btn-reader btn-secondary"
                        onClick={navigateToChapterList}
                    >
                        <FaList className="mr-1" /> Danh sách chương
                    </button>
                    <button 
                        className="btn-reader btn-settings"
                        onClick={toggleSettings}
                    >
                        <FaCog className="mr-1" /> Cấu hình
                    </button>
                    <button 
                        className="btn-reader btn-secondary"
                        onClick={navigateToNextChapter}
                        disabled={!chapterData || !chapterData.nextChapterId}
                    >
                        Chương sau <FaArrowRight className="ml-1" />
                    </button>
                </div>
            </div>

            {/* Popup cấu hình đọc */}
            {showSettings && (
                <div className="settings-popup">
                    <div className="settings-popup-content">
                        <div className="settings-header">
                            <h3>Cài đặt đọc truyện</h3>
                            <button className="close-btn" onClick={toggleSettings}>
                                <FaTimes />
                            </button>
                        </div>
                        <div className="settings-body">
                            <div className="setting-item">
                                <label>Màu nền [ngày]</label>
                                <div className="setting-control">
                                    <input 
                                        type="color" 
                                        value={readerSettings.backgroundColor}
                                        onChange={(e) => handleSettingChange('backgroundColor', e.target.value)}
                                    />
                                </div>
                            </div>
                            
                            <div className="setting-item">
                                <label>Màu chữ [ngày]</label>
                                <div className="setting-control">
                                    <input 
                                        type="color" 
                                        value={readerSettings.textColor}
                                        onChange={(e) => handleSettingChange('textColor', e.target.value)}
                                    />
                                </div>
                            </div>
                            
                            <div className="setting-item">
                                <label>Font chữ</label>
                                <div className="setting-control dropdown">
                                    <select
                                        value={readerSettings.fontFamily}
                                        onChange={(e) => handleSettingChange('fontFamily', e.target.value)}
                                    >
                                        {fontOptions.map((font, index) => (
                                            <option key={index} value={font} style={{fontFamily: font}}>
                                                {font.split(',')[0]}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            
                            <div className="setting-item">
                                <label>Cỡ chữ</label>
                                <div className="setting-control dropdown">
                                    <select
                                        value={`${readerSettings.fontSize}px`}
                                        onChange={(e) => handleSettingChange('fontSize', parseInt(e.target.value))}
                                    >
                                        {[12, 14, 16, 18, 20, 22, 24, 26, 28].map(size => (
                                            <option key={size} value={`${size}px`}>{size}px</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            
                            <div className="setting-item">
                                <label>Chiều cao dòng</label>
                                <div className="setting-control dropdown">
                                    <select
                                        value={`${Math.round(readerSettings.lineHeight * 100)}%`}
                                        onChange={(e) => {
                                            const value = parseInt(e.target.value);
                                            handleSettingChange('lineHeight', value / 100);
                                        }}
                                    >
                                        {[100, 125, 150, 175, 200].map(height => (
                                            <option key={height} value={`${height}%`}>{height}%</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            
                            <div className="setting-item">
                                <label>Canh chữ</label>
                                <div className="setting-control dropdown">
                                    <select
                                        value={readerSettings.textAlign}
                                        onChange={(e) => handleSettingChange('textAlign', e.target.value)}
                                    >
                                        <option value="left">Canh trái</option>
                                        <option value="center">Canh giữa</option>
                                        <option value="right">Canh phải</option>
                                        <option value="justify">Canh đều</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className="setting-item reset-container">
                                <button 
                                    className="reset-btn" 
                                    onClick={resetSettings}
                                >
                                    Mặc định
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="reader-content" style={{
                color: readerSettings.textColor,
                fontFamily: readerSettings.fontFamily,
                fontSize: `${readerSettings.fontSize}px`,
                lineHeight: readerSettings.lineHeight,
                textAlign: readerSettings.textAlign
            }}>
                {isLoading ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Đang tải nội dung chương...</p>
                    </div>
                ) : (
                    <div className="chapter-text" dangerouslySetInnerHTML={{ __html: chapterContent }} />
                )}
            </div>

            <div className="reader-footer">
                <div className="reader-actions">
                    <button 
                        className="btn-reader btn-secondary"
                        onClick={navigateToPreviousChapter}
                        disabled={!chapterData || !chapterData.prevChapterId}
                    >
                        <FaArrowLeft className="mr-1" /> Chương trước
                    </button>
                    <button 
                        className="btn-reader btn-secondary"
                        onClick={navigateToChapterList}
                    >
                        <FaList className="mr-1" /> Danh sách chương
                    </button>
                    <button 
                        className="btn-reader btn-settings"
                        onClick={toggleSettings}
                    >
                        <FaCog className="mr-1" /> Cấu hình
                    </button>
                    <button 
                        className="btn-reader btn-secondary"
                        onClick={navigateToNextChapter}
                        disabled={!chapterData || !chapterData.nextChapterId}
                    >
                        Chương sau <FaArrowRight className="ml-1" /> 
                    </button>
                </div>
            </div>

            {/* Comment section without review tab */}
            <CommentSection 
                storyId={storyId} 
                chapterId={chapterId}
                commentsOnly={true} // Add this prop to hide ratings tab
            />
            <Footer/>
        </div>
    );
}

export default ChapterReaderPage;