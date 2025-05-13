import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchAllChapter } from "../../apis/chapterServices";
import { fetchChapterById } from "../../apis/chapterServices";
import { marked } from "marked";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import CommentSection from "../StoryDetailPage/CommentSection/CommentSection";
import { readChapter } from "../../apis/chapterServices";
import {
  FaArrowLeft,
  FaArrowRight,
  FaList,
  FaCog,
  FaChevronDown,
} from "react-icons/fa";
import "./ChapterReaderPage.scss";

function ChapterReaderPage() {
  const { storyId, chapterId } = useParams();
  const navigate = useNavigate();

  const [chapters, setChapters] = useState([]);
  const [currentChapter, setCurrentChapter] = useState(null);
  const [chapterViews, setChapterViews] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasReadRef = useRef({});

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const defaultSettings = {
    backgroundColor: "#eae4d3",
    textColor: "#333333",
    fontSize: 16,
    fontFamily: "Arial, sans-serif",
    lineHeight: 1.6,
    textAlign: "left",
  };

  const [readerSettings, setReaderSettings] = useState(() => {
    const savedSettings = localStorage.getItem("readerSettings");
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });

  useEffect(() => {
    document.body.style.backgroundColor = readerSettings.backgroundColor;
    localStorage.setItem("readerSettings", JSON.stringify(readerSettings));
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, [readerSettings]);

  // Load metadata danh sách chương
  useEffect(() => {
    async function loadMetadata() {
      setIsLoading(true);
      setError(null);
      try {
        if (!storyId) throw new Error("Story ID missing");
        const meta = await fetchAllChapter(storyId);
        const sorted = meta.sort((a, b) => a.chapterNumber - b.chapterNumber);
        setChapters(sorted);
      } catch (e) {
        console.error(e);
        setError(`Failed to load chapters: ${e.message}`);
        setChapters([]);
      } finally {
        setIsLoading(false);
      }
    }
    window.scrollTo(0, 0);
    loadMetadata();
  }, [storyId]);

  // Load nội dung chương khi thay đổi chapterId
  useEffect(() => {
    async function loadContent() {
      if (!chapterId) return;
      setIsLoading(true);
      setError(null);
      try {
        const chap = await fetchChapterById(chapterId);
        setCurrentChapter(chap);
        setChapterViews(chap.views);

        document.title = `${chap.title} - ${storyId.replace(/-/g, " ")}`;
        // updateReadingHistory(chap);
        // // Tăng view sau khi hiển thị
        // const { chapterViews: newViews } = await readChapter(chapterId);
        // setChapterViews(newViews);
        if (!hasReadRef.current[chapterId]) {
          const { chapterViews: newViews } = await readChapter(chapterId);
          setChapterViews(newViews);
          hasReadRef.current[chapterId] = true;
        }
      } catch (e) {
        console.error(e);
        setError(`Error loading chapter: ${e.message}`);
        setCurrentChapter(null);
      } finally {
        setIsLoading(false);
        window.scrollTo(0, 0);
      }
    }
    loadContent();
  }, [chapterId]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function updateReadingHistory(chap) {
    try {
      const stored = localStorage.getItem("readingHistory");
      const history = stored ? JSON.parse(stored) : [];
      const entry = {
        storyId,
        lastChapterId: chap.id,
        lastChapterTitle: chap.title,
        lastChapterNumber: chap.chapterNumber,
        timestamp: new Date().toISOString(),
      };
      const updated = [
        entry,
        ...history.filter((h) => h.storyId !== storyId),
      ].slice(0, 20);
      localStorage.setItem("readingHistory", JSON.stringify(updated));
    } catch (e) {
      console.error("Reading history error:", e);
    }
  }

  function navigateChapter(id) {
    if (!id) return;
    setDropdownOpen(false);
    navigate(`/story/${storyId}/chapter/${id}`);
  }

  const currentIndex = chapters.findIndex((c) => c.id === chapterId);
  const prevChapterId =
    currentIndex > 0 ? chapters[currentIndex - 1]?.id : null;
  const nextChapterId =
    currentIndex < chapters.length - 1 ? chapters[currentIndex + 1]?.id : null;

  return (
    <div className="chapter-reader-page">
      <Header />
      <div className="reader-header">
        <h2 className="story-title">{storyId.replace(/-/g, " ")}</h2>
        <h3 className="chapter-title">{currentChapter?.title}</h3>
        <div className="reader-actions">
          <button
            disabled={!prevChapterId}
            onClick={() => navigateChapter(prevChapterId)}
          >
            <FaArrowLeft /> Chương trước
          </button>
          <div className="chapter-dropdown-container" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((o) => !o)}
              className="dropdown-button"
            >
              <FaList /> Danh sách chương{" "}
              <FaChevronDown className={dropdownOpen ? "open" : ""} />
            </button>
            {dropdownOpen && (
              <div className="chapters-dropdown">
                {chapters.map((c) => (
                  <div
                    key={c.id}
                    className={`chapter-item ${
                      c.id === chapterId ? "active" : ""
                    }`}
                    onClick={() => navigateChapter(c.id)}
                  >
                    Chương {c.chapterNumber}: {c.title}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button className="settings-button">
            <FaCog /> Cài đặt
          </button>
          <button
            disabled={!nextChapterId}
            onClick={() => navigateChapter(nextChapterId)}
          >
            Chương sau <FaArrowRight />
          </button>
        </div>
      </div>
      <div
        className="reader-content"
        style={{
          backgroundColor: readerSettings.backgroundColor,
          color: readerSettings.textColor,
          fontSize: `${readerSettings.fontSize}px`,
          fontFamily: readerSettings.fontFamily,
          lineHeight: readerSettings.lineHeight,
          textAlign: readerSettings.textAlign,
        }}
      >
        {isLoading ? (
          <div className="loading">Đang tải...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div
            className="chapter-content"
            dangerouslySetInnerHTML={{
              __html: marked(currentChapter?.content || ""),
            }}
          />
        )}
      </div>
      {currentChapter && (
        <CommentSection storyId={storyId} chapterId={chapterId} commentsOnly />
      )}
      <Footer />
    </div>
  );
}

export default ChapterReaderPage;
