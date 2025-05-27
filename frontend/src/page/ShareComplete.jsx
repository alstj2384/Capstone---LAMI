import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./css/ShareComplete.css";

const ShareComplete = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 전달받은 workbookId 추출
  const workbookId = location.state?.workbookId;

  // 공유 URL 생성
  const shareUrl = workbookId
    ? `https://lami.co/solve/${workbookId}`
    : "문제집 ID 없음";

  // URL 복사 기능
  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert("URL이 복사되었습니다!");
    });
  };

  // "탭에서 열기" 클릭 시 Solve 페이지로 이동
  const handleOpen = () => {
    if (workbookId) {
      navigate(`/solve/${workbookId}`);
    } else {
      alert("문제집 ID가 없어 열 수 없습니다.");
    }
  };

  return (
    <div className="share-complete-page">
      <div className="share-complete-container">
        <h1 className="share-complete-title">🎉 문제집이 생성되었습니다! 🎉</h1>
        <div className="share-complete-url-box">
          <span className="share-complete-url-label">공유 URL:</span>
          <span className="share-complete-url">{shareUrl}</span>
        </div>
        <div className="share-complete-buttons">
          <button
            onClick={handleCopy}
            className="share-complete-button share-complete-copy-button"
          >
            복사하기
          </button>
          <button
            onClick={handleOpen}
            className="share-complete-button share-complete-open-button"
          >
            탭에서 열기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareComplete;
