import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getProblemList,
  getProblem,
  requestGrading,
  getGradingList,
} from "../api";
import "./css/Solve.css";

const Solve = () => {
  const navigate = useNavigate();
  const { quizSetId } = useParams();
  const token = localStorage.getItem("token");
  const memberId = localStorage.getItem("memberId");
  // 로딩 상태
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [problemList, setProblemList] = useState([]);
  const [currentProblemId, setCurrentProblemId] = useState(null);
  const [currentProblem, setCurrentProblem] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [time, setTime] = useState(0);
  const [workbook, setWorkbook] = useState(null);

  useEffect(() => {
    const fetchWorkbookInfo = async () => {
      try {
        const res = await getWorkbook(quizSetId);
        setWorkbook(res.data); // API 구조에 따라 조정
      } catch (err) {
        console.error("문제집 정보 불러오기 실패", err);
      }
    };

    fetchWorkbookInfo();
  }, [quizSetId]);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const listRes = await getProblemList(quizSetId, token);
        const list = listRes.data;
        setProblemList(list);
        if (list.length > 0) {
          setCurrentProblemId(list[0].problemId);
        }
      } catch (err) {
        console.error("문제 리스트 불러오기 실패", err);
      }
    };

    fetchProblems();
  }, [quizSetId, token]);

  useEffect(() => {
    if (!currentProblemId) return;
    const fetchProblem = async () => {
      try {
        const problem = await getProblem(currentProblemId, token);
        setCurrentProblem(problem);
      } catch (err) {
        console.error("문제 단건 조회 실패", err);
      }
    };
    fetchProblem();
  }, [currentProblemId, token]);

  useEffect(() => {
    const timer = setInterval(() => setTime((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAnswerChange = (problemId, answer) => {
    setUserAnswers((prev) => ({ ...prev, [problemId]: answer }));
  };

  const handleSubmit = async () => {
    if (isSubmitting) return; // 두 번 클릭 방지
    setIsSubmitting(true); // 로딩 시작

    const answers = problemList.map((problem) => ({
      quizId: problem.problemId,
      quizType: problem.questionType,
      answer: userAnswers[problem.problemId],
    }));

    try {
      const res = await requestGrading(
        {
          quizSetId: parseInt(quizSetId),
          answers,
        },
        token
      );
      console.log("📝 requestGrading 응답:", res); // ✅ 바로 여기!

      if (res) {
        const GradingId = res.data.gradingId;
        navigate("/result", { state: { gradingId: GradingId } });
      }
    } catch (err) {
      console.error("채점 실패", err);
      alert("채점 도중 오류가 발생했습니다. 다시 시도해주세요.");
      setIsSubmitting(false); // 실패 시 다시 클릭 가능하도록
    }
  };

  const formatTime = (seconds) => {
    const hours = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${hours}:${mins}:${secs}`;
  };

  const answeredCount = Object.keys(userAnswers).length;
  const total = problemList.length;
  const progress = (answeredCount / total) * 100;
  const getQuestionTypeLabel = (type) => {
    switch (type) {
      case "SHORT_ANSWER":
        return "단답식";
      case "TRUE_FALSE":
        return "O/X 문제";
      case "MULTIPLE_CHOICE":
        return "객관식";
      default:
        return type;
    }
  };

  return (
    <div className="solve-page">
      {isSubmitting && (
        <div className="loading-overlay">
          <div className="spinner" />
          <p>제출 중입니다...</p>
        </div>
      )}

      <div className="solve-header">
        <h1 className="solve-title">{workbook?.title} 문제 풀이</h1>
        <span className="solve-timer">소요시간 {formatTime(time)}</span>
      </div>

      <div className="solve-main">
        <div className="solve-sidebar">
          {problemList.map((problem, idx) => (
            <div
              key={problem.problemId}
              className={`solve-problem-item ${
                currentProblemId === problem.problemId
                  ? "active"
                  : userAnswers[problem.problemId]
                  ? "completed"
                  : ""
              }`}
              onClick={() => setCurrentProblemId(problem.problemId)}
            >
              {idx + 1}. {getQuestionTypeLabel(problem.questionType)}
            </div>
          ))}
          <button onClick={handleSubmit} className="solve-submit-button">
            제출하기
          </button>
        </div>
        
        <div className="solve-content">
          <div className="solve-progress-bar">
            <div
              className="solve-progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="solve-progress-info">
            <span>
              {answeredCount}/{total}
            </span>
            <span>{progress.toFixed(0)}%</span>
          </div>

          {currentProblem && (
            <div className="solve-problem">
              <h2 className="solve-problem-title">
                문제 {currentProblem.sequenceNumber}번
              </h2>
              <p className="solve-problem-question">
                {currentProblem.question}
              </p>

              {currentProblem.questionType === "MULTIPLE_CHOICE" && (
                <div className="solve-answer-options">
                  {currentProblem.choices.split(",").map((choice, index) => (
                    <label key={index} className="solve-answer-option">
                      <input
                        type="radio"
                        name={`problem-${currentProblem.problemId}`}
                        value={index + 1}
                        checked={
                          userAnswers[currentProblem.problemId] == index + 1
                        }
                        onChange={() =>
                          handleAnswerChange(
                            currentProblem.problemId,
                            index + 1
                          )
                        }
                      />
                      <span>{choice}</span>
                    </label>
                  ))}
                </div>
              )}

              {currentProblem.questionType === "TRUE_FALSE" && (
                <div className="solve-answer-options">
                  {["O", "X"].map((val) => (
                    <label key={val} className="solve-answer-option">
                      <input
                        type="radio"
                        name={`problem-${currentProblem.problemId}`}
                        value={val}
                        checked={userAnswers[currentProblem.problemId] === val}
                        onChange={() =>
                          handleAnswerChange(currentProblem.problemId, val)
                        }
                      />
                      <span>{val}</span>
                    </label>
                  ))}
                </div>
              )}

              {currentProblem.questionType === "SHORT_ANSWER" && (
                <input
                  type="text"
                  value={userAnswers[currentProblem.problemId] || ""}
                  onChange={(e) =>
                    handleAnswerChange(currentProblem.problemId, e.target.value)
                  }
                  placeholder="정답을 입력하세요"
                  className="solve-short-answer-input"
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Solve;
