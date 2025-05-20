import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./css/Result.css";

const Result = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { userAnswers, problems } = state || { userAnswers: {}, problems: [] };

  // 페이지 로드 시 스크롤 최상단으로 이동
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 디버깅: 전달된 데이터 확인
  console.log("전달된 userAnswers:", userAnswers);
  console.log("전달된 problems:", problems);

  // 채점 로직
  const results = problems.map((problem) => {
    const userAnswer = userAnswers[problem.id] || "";
    let isCorrect = false;

    if (problem.type === "multiple" || problem.type === "shortanswer") {
      isCorrect = userAnswer === problem.answer;
    } else if (problem.type === "truefalse") {
      isCorrect = userAnswer === (problem.answer ? "true" : "false");
    }

    return {
      ...problem,
      userAnswer,
      isCorrect,
    };
  });

  // 디버깅: 채점 결과 확인
  console.log("채점 결과:", results);

  // 피드백 (하드코딩)
  const feedback =
    "정답을 맞춘 문제는 잘 이해하고 있네요! 오답인 문제는 다시 한 번 개념을 복습해보세요.";

  // 다시 풀어보기 버튼
  const handleRetry = () => {
    navigate("/solve");
  };

  // 나가기 버튼
  const handleExit = () => {
    navigate("/explore");
  };

  return (
    <div className="result-page">
      <div className="result-container">
        <h1 className="result-title">채점 결과</h1>
        {results.length > 0 ? (
          results.map((result) => (
            <div key={result.id} className="result-problem">
              <h2 className="result-problem-title">문제 {result.id}번</h2>
              <p className="result-problem-question">{result.question}</p>
              {result.type === "multiple" && (
                <div className="result-answer-options">
                  {result.options.map((option, index) => (
                    <label key={index} className="result-answer-option">
                      <input
                        type="radio"
                        name={`problem-${result.id}`}
                        value={option}
                        checked={result.userAnswer === option}
                        disabled
                        className="result-answer-input"
                      />
                      <span
                        className={
                          result.userAnswer === option
                            ? result.isCorrect
                              ? "text-green-500"
                              : "text-red-500"
                            : ""
                        }
                      >
                        {option}
                      </span>
                    </label>
                  ))}
                </div>
              )}
              {result.type === "truefalse" && (
                <div className="result-answer-options">
                  <label className="result-answer-option">
                    <input
                      type="radio"
                      name={`problem-${result.id}`}
                      value="true"
                      checked={result.userAnswer === "true"}
                      disabled
                      className="result-answer-input"
                    />
                    <span
                      className={
                        result.userAnswer === "true"
                          ? result.isCorrect
                            ? "text-green-500"
                            : "text-red-500"
                          : ""
                      }
                    >
                      O
                    </span>
                  </label>
                  <label className="result-answer-option">
                    <input
                      type="radio"
                      name={`problem-${result.id}`}
                      value="false"
                      checked={result.userAnswer === "false"}
                      disabled
                      className="result-answer-input"
                    />
                    <span
                      className={
                        result.userAnswer === "false"
                          ? result.isCorrect
                            ? "text-green-500"
                            : "text-red-500"
                          : ""
                      }
                    >
                      X
                    </span>
                  </label>
                </div>
              )}
              {result.type === "shortanswer" && (
                <div className="result-answer-input">
                  <input
                    type="text"
                    value={result.userAnswer || ""}
                    disabled
                    className={`result-short-answer-input ${
                      result.isCorrect ? "border-green-500" : "border-red-500"
                    }`}
                  />
                </div>
              )}
              <div className="result-feedback">
                <span
                  className={
                    result.isCorrect ? "text-green-500" : "text-red-500"
                  }
                >
                  {result.isCorrect ? "정답" : "오답"}
                </span>
                <p className="result-feedback-text">
                  정답:{" "}
                  {result.type === "truefalse"
                    ? result.answer
                      ? "O"
                      : "X"
                    : result.answer}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="result-empty">채점 결과가 없습니다.</p>
        )}
        <div className="result-overall-feedback">
          <h2 className="result-feedback-title">피드백</h2>
          <p className="result-feedback-content">{feedback}</p>
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
