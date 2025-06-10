import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./css/ShareComplete.css";

const ShareComplete = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 전달받은 workbookId 추출
  const workbookId = location.state?.workbookId;

  // 공유 URL 생성 http://10.116.64.23/solve/17
  const shareUrl = workbookId
    ? `http://10.116.64.23/solve/${workbookId}`
    : "문제집 ID 없음";

  // URL 복사 기능
  const handleCopy = async () => {
    try {
      // Clipboard API 시도
      await navigator.clipboard.writeText(shareUrl);
      alert("✅ URL이 복사되었습니다!");
    } catch (err) {
      console.warn("❌ Clipboard API 실패, fallback으로 복사 시도:", err);

      // fallback: execCommand 사용
      const textarea = document.createElement("textarea");
      textarea.value = shareUrl;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        const success = document.execCommand("copy");
        alert(success ? "✅ URL이 복사되었습니다!" : "⚠️ 복사 실패");
      } catch (e) {
        alert("❌ 복사에 실패했습니다. 수동으로 복사해주세요.");
      }
      document.body.removeChild(textarea);
    }
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
