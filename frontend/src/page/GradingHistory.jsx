// 📁 src/pages/GradingHistory.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getGradingList } from "../api";
import SquirrelIcon from "../assets/DALAMI_2.svg"; // 같은 아이콘 재사용
import "./css/Review.css"; // ✅ Review.css 사용

const GradingHistory = () => {
  const [gradingList, setGradingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("memberId");

  useEffect(() => {
    if (!token || !userId) {
      console.warn("❗ 토큰 또는 사용자 ID가 없음");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const res = await getGradingList(token, userId);
        console.log("📥 채점 기록 응답:", res);

        const list = res?.data?.gradingList || [];
        setGradingList(list);
      } catch (err) {
        console.error("❌ 채점 기록 불러오기 실패:", err);
        alert("채점 기록을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, userId]);

  const handleClick = (gradingId) => {
    navigate(`/grading-result/${gradingId}`);
  };

  return (
    <div className="review-page">
      <div className="review-container">
        <h1 className="review-title">📊 채점 기록</h1>

        {loading ? (
          <p className="review-loading">기록을 불러오는 중입니다...</p>
        ) : gradingList.length > 0 ? (
          <div className="review-problem-sets">
            {gradingList.map((record, idx) => (
              <div key={record.gradingId || idx} className="review-problem-set">
                <img
                  src={SquirrelIcon}
                  alt="Icon"
                  className="review-problem-set-icon"
                />
                <h3 className="review-problem-set-title">
                  {record.workbookTitle || "제목 없음"}
                </h3>

                <p className="review-problem-set-date">
                  {record.createdAt
                    ? new Date(record.createdAt).toLocaleDateString()
                    : "날짜 없음"}
                </p>

                <p className="review-answer">
                  점수: <strong>{record.score ?? "N/A"}점</strong>
                </p>

                <button
                  className="review-problem-set-button"
                  onClick={() => handleClick(record.gradingId)}
                >
                  결과 보기
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="review-empty">채점 기록이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default GradingHistory;
