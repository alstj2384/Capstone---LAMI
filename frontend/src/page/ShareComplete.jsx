import React from "react";
import { useNavigate } from "react-router-dom";
import "./css/ShareComplete.css"; // CSS 파일 임포트

const ShareComplete = () => {
  const navigate = useNavigate();
  const hardcodedUrl = "https://lami.co/asdf1234asdf...";

  // URL 복사 기능
  const handleCopy = () => {
    navigator.clipboard.writeText(hardcodedUrl).then(() => {
      alert("URL이 복사되었습니다!");
    });
  };

  // "탭에서 열기" 버튼 클릭 시 Solve 페이지로 이동
  const handleOpen = () => {
    navigate("/solve");
  };

  return (
    <div className="share-complete-page">
      <div className="share-complete-container">
        <h1 className="share-complete-title">🎉 문제집이 생성되었습니다! 🎉</h1>
        <div className="share-complete-url-box">
          <span className="share-complete-url-label">공유 URL:</span>
          <span className="share-complete-url">{hardcodedUrl}</span>
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
