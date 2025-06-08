import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getGradingList, getGrading, getWorkbook } from "../api"; // ✅ getWorkbook 추가
import SquirrelIcon from "../assets/DALAMI_2.svg";
import "./css/Review.css";

const GradingHistory = () => {
  const [gradingDetails, setGradingDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const memberId = localStorage.getItem("memberId");

  useEffect(() => {
    const fetchData = async () => {
      if (!token || !memberId) {
        setLoading(false);
        return;
      }

      try {
        const res = await getGradingList(token, memberId);
        const gradingIds = res?.data?.gradingList || [];

        const results = await Promise.all(
          gradingIds.map(async (id) => {
            try {
              const gradingRes = await getGrading(id, token, memberId);
              const gradingData = gradingRes?.data;

              const workbookRes = await getWorkbook(gradingData.quizSetId);
              const workbookTitle = workbookRes?.data?.title || "제목 없음";

              return {
                gradingId: gradingData.gradingId,
                quizSetId: gradingData.quizSetId,
                correctCount: gradingData.correctCount,
                totalCount: gradingData.totalCount,
                submissionDate: gradingData.submissionDate,
                workbookTitle, // ✅ 제목 추가
              };
            } catch (e) {
              console.warn("⚠️ 일부 채점 데이터 불러오기 실패:", id, e);
              return null;
            }
          })
        );

        setGradingDetails(results.filter(Boolean));
      } catch (error) {
        console.error("❌ 채점 기록 불러오기 실패:", error);
        alert("채점 기록을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, memberId]);

  const handleClick = (gradingId) => {
    navigate(`/grading-result/${gradingId}`);
  };

  return (
    <div className="review-page">
      <div className="review-container">
        <h1 className="review-title">📊 채점 기록</h1>

        {loading ? (
          <p className="review-loading">기록을 불러오는 중입니다...</p>
        ) : gradingDetails.length > 0 ? (
          <div className="review-problem-sets">
            {gradingDetails.map((record) => (
              <div key={record.gradingId} className="review-problem-set">
                <img
                  src={SquirrelIcon}
                  alt="Icon"
                  className="review-problem-set-icon"
                />
                <h3 className="review-problem-set-title">
                  {record.workbookTitle}
                </h3>
                <p className="review-problem-set-date">
                  {record.submissionDate ?? "날짜 없음"}
                </p>
                <p className="review-answer">
                  점수:{" "}
                  <strong>
                    {record.correctCount}/{record.totalCount}
                  </strong>
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
