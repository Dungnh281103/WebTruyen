import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ChapterReaderPage.scss';
import ReadingSettingsPanel from '../../components/ReadingSettingsPanel/ReadingSettingsPanel';
import CommentSection from '../../components/CommentSection/CommentSection';
import ErrorReportButton from '../../components/ErrorReportButton/ErrorReportButton';

function ChapterReaderPage() {
    const { storyId, chapterId } = useParams();
    const [chapterContent, setChapterContent] = useState('');
    const [storyTitle, setStoryTitle] = useState('');
    const [chapterTitle, setChapterTitle] = useState('');
    const [showSettings, setShowSettings] = useState(false);

    useEffect(() => {
        // Giả sử có hàm fetchChapter để lấy nội dung chương từ API
        fetchChapter(storyId, chapterId)
            .then(data => {
                setChapterContent(data.content);
                setStoryTitle(data.storyTitle);
                setChapterTitle(data.chapterTitle);
            })
            .catch(error => {
                console.error("Failed to fetch chapter:", error);
                setChapterContent("Không thể tải nội dung chương.");
            });
    }, [storyId, chapterId]);

    const handleSettingsToggle = () => {
        setShowSettings(!showSettings);
    };

    // Hàm giả định lấy dữ liệu từ API
    async function fetchChapter(storyId, chapterId) {
        // Thay thế bằng API call thực tế
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    storyTitle: 'Đấu Phá Thương Khung',
                    chapterTitle: `Chương ${chapterId}: ...`,
                    content: `Nội dung chương ${chapterId} của truyện ${storyId}... `.repeat(50), // Nội dung giả định
                });
            }, 500);
        });
    }

    return (
        <div className="chapter-reader-page">
            <div className="reader-header">
                <h2>{storyTitle}</h2>
                <h3>{chapterTitle}</h3>
                <div className="reader-actions">
                    <button className="btn btn-secondary" onClick={() => {/* Điều hướng chương trước */ }}>Chương trước</button>
                    <button className="btn btn-secondary" onClick={() => {/* Điều hướng danh sách chương */ }}>Danh sách chương</button>
                    <button className="btn btn-secondary" onClick={() => {/* Điều hướng chương sau */ }}>Chương sau</button>
                    <button className="btn btn-secondary" onClick={handleSettingsToggle}>Cài đặt</button>
                    <ErrorReportButton storyId={storyId} chapterId={chapterId}/>
                </div>
            </div>

            <div className="reader-content">
                <div className="chapter-text" dangerouslySetInnerHTML={{ __html: chapterContent }} />
            </div>

            <CommentSection storyId={storyId} chapterId={chapterId} />

            {showSettings && <ReadingSettingsPanel />}
        </div>
    );
}

export default ChapterReaderPage;