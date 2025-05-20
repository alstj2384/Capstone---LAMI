import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { endpoints } from "../url";
import "./css/Result.css";

const Result = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { gradingId } = state || {};

  const [gradingResult, setGradingResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchGradingResult = async () => {
      if (!gradingId) return;

      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      try {
        const response = await axios.get(`${endpoints.getGradingResult}/${gradingId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-User-ID": userId,
          },
        });

        setGradingResult(response.data.data);
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

        {gradingResult.submissions.map((item) => (
          <div key={item.quizId} className="result-problem">
            <h2 className="result-problem-title">문제 {item.quizId}번</h2>
            <p className="result-feedback-text">정답: {item.answer}</p>
            <p className="result-feedback-text">제출한 답: {item.submittedAnswer}</p>
            <span
              className={item.isCorrect ? "text-green-500" : "text-red-500"}
            >
              {item.isCorrect ? "정답" : "오답"}
            </span>
            <div className="result-feedback">
              <p className="result-feedback-text">암기법: {item.memorization}</p>
              <p className="result-feedback-text">피드백: {item.feedback}</p>
            </div>
          </div>
        ))}

        <div className="result-overall-feedback">
          <h2 className="result-feedback-title">총평</h2>
          <p className="result-feedback-content">
            총 문제 수: {gradingResult.totalCount}, 정답 수: {gradingResult.correctCount}, 오답 수: {gradingResult.incorrectCount}
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
