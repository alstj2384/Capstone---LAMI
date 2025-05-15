import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./css/Solve.css";

const Solve = () => {
  const navigate = useNavigate();

  // 하드코딩된 문제 데이터 (10개 문제: 객관식 4개, O/X 3개, 단답형 3개)
  const problems = [
    {
      id: 1,
      type: "multiple",
      question: "다음 중 프로그래밍 언어가 아닌 것은?",
      options: ["Python", "Java", "HTML", "C++"],
      answer: "HTML",
    },
    {
      id: 2,
      type: "truefalse",
      question: "파이썬은 객체지향 프로그래밍 언어이다.",
      answer: true,
    },
    {
      id: 3,
      type: "shortanswer",
      question: "파이썬에서 리스트를 생성하는 함수는?",
      answer: "list",
    },
    {
      id: 4,
      type: "multiple",
      question: "다음 중 데이터베이스 관리 시스템이 아닌 것은?",
      options: ["MySQL", "PostgreSQL", "Excel", "SQLite"],
      answer: "Excel",
    },
    {
      id: 5,
      type: "truefalse",
      question: "HTML은 프로그래밍 언어이다.",
      answer: false,
    },
    {
      id: 6,
      type: "shortanswer",
      question: "CSS에서 색상을 지정하는 속성은?",
      answer: "color",
    },
    {
      id: 7,
      type: "multiple",
      question: "다음 중 네트워크 프로토콜이 아닌 것은?",
      options: ["HTTP", "FTP", "SQL", "TCP"],
      answer: "SQL",
    },
    {
      id: 8,
      type: "truefalse",
      question: "Java는 플랫폼 독립적이다.",
      answer: true,
    },
    {
      id: 9,
      type: "shortanswer",
      question: "JavaScript에서 변수 선언 키워드는?",
      answer: "let",
    },
    {
      id: 10,
      type: "multiple",
      question: "다음 중 운영체제가 아닌 것은?",
      options: ["Windows", "Linux", "Android", "Photoshop"],
      answer: "Photoshop",
    },
  ];

  // 현재 선택된 문제와 사용자 답변 상태
  const [currentProblemId, setCurrentProblemId] = useState(1);
  const [userAnswers, setUserAnswers] = useState({});

  // 타이머 상태
  const [time, setTime] = useState(0);

  // 페이지 로드 시 타이머 시작
  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 타이머 포맷팅 (00:00:00)
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, "0");
    const mins = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${hours}:${mins}:${secs}`;
  };

  // 현재 문제 선택
  const currentProblem = problems.find(
    (problem) => problem.id === currentProblemId
  );

  // 답변 처리
  const handleAnswerChange = (problemId, answer) => {
    setUserAnswers((prev) => ({
      ...prev,
      [problemId]: answer,
    }));
  };

  // 제출 처리
  const handleSubmit = () => {
    console.log("사용자 답변:", userAnswers);
    console.log("문제 데이터:", problems);

    // 챌린지 날짜 업데이트
    const today = new Date().toISOString().split("T")[0]; // 오늘 날짜 (YYYY-MM-DD)
    const lastSolveDate = localStorage.getItem("lastSolveDate");
    let challengeDays = parseInt(localStorage.getItem("challengeDays") || "0");

    if (lastSolveDate !== today) {
      // 오늘 처음 푼 경우, 챌린지 날짜 증가
      challengeDays += 1;
      localStorage.setItem("lastSolveDate", today);
      localStorage.setItem("challengeDays", challengeDays.toString());
    }

    navigate("/result", { state: { userAnswers, problems } });
  };

  // 답변한 문제 수 계산
  const answeredProblemsCount = Object.keys(userAnswers).length;
  const totalProblems = problems.length;
  const progressPercentage = (answeredProblemsCount / totalProblems) * 100;

  return (
    <div className="solve-page">
      <div className="solve-header">
        <h1 className="solve-title">문제 풀기</h1>
        <span className="solve-timer">소요시간 {formatTime(time)}</span>
      </div>

      <div className="solve-main">
        {/* 좌측: 문제 목록 */}
        <div className="solve-sidebar">
          <div className="solve-sidebar-section">
            <h2 className="solve-sidebar-section-title">객관식</h2>
            {problems
              .filter((problem) => problem.type === "multiple")
              .map((problem) => (
                <div
                  key={problem.id}
                  className={`solve-problem-item ${
                    currentProblemId === problem.id
                      ? "active"
                      : userAnswers[problem.id]
                      ? "completed"
                      : ""
                  }`}
                  onClick={() => setCurrentProblemId(problem.id)}
                >
                  {problem.id}. 객관식 문제
                </div>
              ))}
          </div>
          <div className="solve-sidebar-section">
            <h2 className="solve-sidebar-section-title">단답형</h2>
            {problems
              .filter((problem) => problem.type === "shortanswer")
              .map((problem) => (
                <div
                  key={problem.id}
                  className={`solve-problem-item ${
                    currentProblemId === problem.id
                      ? "active"
                      : userAnswers[problem.id]
                      ? "completed"
                      : ""
                  }`}
                  onClick={() => setCurrentProblemId(problem.id)}
                >
                  {problem.id}. 단답형 문제
                </div>
              ))}
          </div>
          <div>
            <h2 className="solve-sidebar-section-title">O/X</h2>
            {problems
              .filter((problem) => problem.type === "truefalse")
              .map((problem) => (
                <div
                  key={problem.id}
                  className={`solve-problem-item ${
                    currentProblemId === problem.id
                      ? "active"
                      : userAnswers[problem.id]
                      ? "completed"
                      : ""
                  }`}
                  onClick={() => setCurrentProblemId(problem.id)}
                >
                  {problem.id}. O/X 문제
                </div>
              ))}
          </div>
        </div>

        {/* 우측: 현재 문제 */}
        <div className="solve-content">
          {/* 진행률 바 */}
          <div className="solve-progress-bar">
            <div
              className="solve-progress-fill"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="solve-progress-info">
            <span>
              {answeredProblemsCount}/{totalProblems}
            </span>
            <span>{progressPercentage.toFixed(0)}%</span>
          </div>

          {/* 현재 문제 표시 */}
          <div className="solve-problem">
            <h2 className="solve-problem-title">문제 {currentProblem.id}번</h2>
            <p className="solve-problem-question">{currentProblem.question}</p>
            {currentProblem.type === "multiple" && (
              <div className="solve-answer-options">
                {currentProblem.options.map((option, index) => (
                  <label key={index} className="solve-answer-option">
                    <input
                      type="radio"
                      name={`problem-${currentProblem.id}`}
                      value={option}
                      checked={userAnswers[currentProblem.id] === option}
                      onChange={() =>
                        handleAnswerChange(currentProblem.id, option)
                      }
                      className="solve-answer-input"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            )}
            {currentProblem.type === "truefalse" && (
              <div className="solve-answer-options">
                <label className="solve-answer-option">
                  <input
                    type="radio"
                    name={`problem-${currentProblem.id}`}
                    value="true"
                    checked={userAnswers[currentProblem.id] === "true"}
                    onChange={() =>
                      handleAnswerChange(currentProblem.id, "true")
                    }
                    className="solve-answer-input"
                  />
                  <span>O</span>
                </label>
                <label className="solve-answer-option">
                  <input
                    type="radio"
                    name={`problem-${currentProblem.id}`}
                    value="false"
                    checked={userAnswers[currentProblem.id] === "false"}
                    onChange={() =>
                      handleAnswerChange(currentProblem.id, "false")
                    }
                    className="solve-answer-input"
                  />
                  <span>X</span>
                </label>
              </div>
            )}
            {currentProblem.type === "shortanswer" && (
              <input
                type="text"
                value={userAnswers[currentProblem.id] || ""}
                onChange={(e) =>
                  handleAnswerChange(currentProblem.id, e.target.value)
                }
                placeholder="정답을 입력하세요"
                className="solve-short-answer-input"
              />
            )}
          </div>

          {/* 제출 버튼 */}
          <button onClick={handleSubmit} className="solve-submit-button">
            제출하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Solve;
