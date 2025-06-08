import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getGrading, createReview } from "../api";
import "./css/Result.css";

const GradingResult = () => {
  const { id } = useParams(); // gradingId
  const navigate = useNavigate();

  const [grading, setGrading] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewedQuizIds, setReviewedQuizIds] = useState(new Set());

  const token = localStorage.getItem("token");
  const memberId = localStorage.getItem("memberId");

  useEffect(() => {
    const fetchGrading = async () => {
      try {
        const res = await getGrading(id, token, memberId);
        setGrading(res.data || res);
      } catch (error) {
        console.error("❌ 채점 결과 오류:", error);
        alert("채점 결과를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (id && token && memberId) {
      fetchGrading();
    } else {
      setLoading(false);
    }
  }, [id, token, memberId]);

  const handleAddReview = async (gradingId, quizId) => {
    try {
      await createReview(token, memberId, { gradingId, quizId });
      alert("복습 목록에 추가되었습니다.");
      setReviewedQuizIds((prev) => new Set(prev).add(quizId));
    } catch (err) {
      console.error("복습 추가 실패:", err);
      alert("복습 추가에 실패했습니다.");
    }
  };

  if (loading)
    return <div className="result-page">채점 결과를 불러오는 중입니다...</div>;
  if (!grading)
    return <div className="result-page">채점 결과가 존재하지 않습니다.</div>;

  return (
    <div className="result-page">
      <div className="result-container">
        <h1 className="result-title">채점 결과</h1>

        {grading.submissions?.map((item, index) => (
          <div key={item.quizId} className="result-problem">
            <h2 className="result-problem-title">문제 {index + 1}번</h2>
            <p className="result-feedback-text">정답: {item.answer}</p>
            <p className="result-feedback-text">
              제출한 답: {item.submittedAnswer}
            </p>
            <span
              className={item.isCorrect ? "text-green-500" : "text-red-500"}
            >
              {item.isCorrect ? "정답" : "오답"}
            </span>

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

            {reviewedQuizIds.has(item.quizId) ? (
              <div className="review-done">✅ 복습에 추가 완료</div>
            ) : (
              <div className="review-add-button-container">
                <button
                  className="review-add-button"
                  onClick={() =>
                    handleAddReview(grading.gradingId, item.quizId)
                  }
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
            총 문제 수: {grading.totalCount}, 정답 수: {grading.correctCount},
            오답 수: {grading.incorrectCount}
          </p>
        </div>

        <div className="result-buttons">
          <button onClick={() => navigate(-1)} className="result-retry-button">
            이전으로
          </button>
        </div>
      </div>
    </div>
  );
};

export default GradingResult;
