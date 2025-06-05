import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getGrading, createReview } from "../api"; // ✅ 수정: API 함수 import
import "./css/Result.css";

const Result = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { gradingId } = state || {};

  const [gradingResult, setGradingResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewedQuizIds, setReviewedQuizIds] = useState(new Set());


  useEffect(() => {
    const fetchGradingResult = async () => {
      if (!gradingId) {
        console.warn("gradingId가 없습니다.");
        return;
      }

      const token = localStorage.getItem("token");

      try {
        const result = await getGrading(gradingId, token);
        console.log("채점 결과:", result);
        setGradingResult(result.data);
      } catch (error) {
        console.error("채점 결과 조회 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGradingResult();
  }, [gradingId]);

  const handleRetry = () => {
    navigate("/solve");
  };

  const handleExit = () => {
    navigate("/explore");
  };

  const handleAddReview = async (gradingId, quizId) => {
    const token = localStorage.getItem("token");
    const memberId = localStorage.getItem("memberId");

    const data = {
      gradingId: gradingId,
      quizId: quizId,
    };

    try {
      await createReview(token, memberId, data);
      alert("복습 목록에 추가되었습니다.");
      setReviewedQuizIds((prev) => new Set(prev).add(quizId));
    } catch (error) {
      console.error("복습 추가 실패:", error);
      alert("복습 추가에 실패했습니다.");
    }
  };

  if (loading) {
    return <div className="result-page">채점 결과를 불러오는 중입니다...</div>;
  }

  if (!gradingResult) {
    return <div className="result-page">채점 결과가 존재하지 않습니다.</div>;
  }

  return (
    <div className="result-page">
      <div className="result-container">
        <h1 className="result-title">채점 결과</h1>

        {gradingResult.submissions.map((item, index) => (
          <div key={item.quizId} className="result-problem">
            <h2 className="result-problem-title">문제 {index + 1}번</h2>
            <p className="result-feedback-text">정답: {item.answer}</p>
            <p className="result-feedback-text">제출한 답: {item.submittedAnswer}</p>
            <span className={item.isCorrect ? "text-green-500" : "text-red-500"}>
              {item.isCorrect ? "정답" : "오답"}
            </span>
            <div className="result-feedback">
              <div className="result-feedback">
                <div className="result-feedback-block">
                  <p className="result-feedback-label">피드백</p>
                  <p className="result-feedback-text">{item.feedback}</p>
                </div>

                <div className="result-feedback-block">
                  <p className="result-feedback-label">암기법</p>
                  <p className="result-feedback-text">{item.memorization}</p>
                </div>
              </div>
            </div>
            {reviewedQuizIds.has(item.quizId) ? (
              <div className="review-done">
                ✅ 복습에 추가 완료
              </div>
            ) : (
              <div className="review-add-button-container">
                <button
                  className="review-add-button"
                  onClick={() => handleAddReview(gradingResult.gradingId, item.quizId)}
                >
                  복습에 추가하기
                </button>
              </div>
            )}

          </div>
        ))}

        <div className="result-overall-feedback">
          <h2 className="result-feedback-title">총평</h2>
          <p className="result-feedback-content">
            총 문제 수: {gradingResult.totalCount}, 정답 수:{" "}
            {gradingResult.correctCount}, 오답 수:{" "}
            {gradingResult.incorrectCount}
          </p>
        </div>

        <div className="result-buttons">
          <button onClick={handleRetry} className="result-retry-button">
            다시 풀어보기
          </button>
          <button onClick={handleExit} className="result-exit-button">
            나가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Result;
