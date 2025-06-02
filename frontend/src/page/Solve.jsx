import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProblemList, getProblem, requestGrading, getGradingList } from "../api";
import "./css/Solve.css";

const Solve = () => {
  const navigate = useNavigate();
  const { quizSetId } = useParams();
  const token = localStorage.getItem("token");
  const memberId = localStorage.getItem("memberId");

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
    const answers = problemList.map((problem) => ({
      quizId: problem.problemId,
      quizType: problem.questionType,
      answer: userAnswers[problem.problemId],
    }));

    try {
      console.log(answers)
      const res = await requestGrading(
        {
          quizSetId: parseInt(quizSetId),
          answers,
        },
        token
      );

      //res에서 채점 ID를 가져올 필요가 있다.
      if (res) {
        // 채점 목록 가져오기 - 채점 완료시 해당 채점ID 넘기게 변경필요
        // 아래는 임시로 채점목록중 최신 채점으로 이동
        //const resGradingList = await getGradingList(token, memberId)

        //const GradingId = resGradingList.data.gradingList[0]
        
        console.log(res.data.gradingId)
        const GradingId = res.data.gradingId

        navigate("/result", { state: GradingId });
      }

    } catch (err) {
      console.error("채점 실패", err);
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

  return (
    <div className="solve-page">
      <div className="solve-header">
        <h1 className="solve-title">{workbook?.title} 문제 풀이</h1>
        <span className="solve-timer">소요시간 {formatTime(time)}</span>
      </div>

      <div className="solve-main">
        <div className="solve-sidebar">
          {problemList.map((problem, idx) => (
            <div
              key={problem.problemId}
              className={`solve-problem-item ${currentProblemId === problem.problemId
                ? "active"
                : userAnswers[problem.problemId]
                  ? "completed"
                  : ""
                }`}
              onClick={() => setCurrentProblemId(problem.problemId)}
            >
              {idx + 1}. {problem.questionType.replace("_", " ")}
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
