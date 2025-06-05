import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProblemList, getWorkbook, updateProblems } from "../api";
import "./css/EditWorkBook.css";

const EditWorkBook = () => {
  const navigate = useNavigate();
  const { workbookId } = useParams();
  const token = localStorage.getItem("token");
  const memberId = localStorage.getItem("memberId");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [workbookMeta, setWorkbookMeta] = useState({});
  const [problemList, setProblemList] = useState([]);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const res1 = await getWorkbook(workbookId);
        setWorkbookMeta(res1.data);

        const res2 = await getProblemList(workbookId, token);
        const problems = res2.data.map((problem) => ({
          ...problem,
          choicesArray: problem.choices ? problem.choices.split(",") : [],
        }));
        setProblemList(problems);
      } catch (err) {
        console.error("문제집 불러오기 실패", err);
      }
    };

    fetchProblems();
  }, [workbookId, token]);

  const handleQuestionChange = (index, value) => {
    const updated = [...problemList];
    updated[index].question = value;
    setProblemList(updated);
  };

  const handleAnswerChange = (index, value) => {
    const updated = [...problemList];
    updated[index].answer = value;
    setProblemList(updated);
  };

  const handleChoiceChange = (problemIndex, choiceIndex, value) => {
    const updated = [...problemList];
    updated[problemIndex].choicesArray[choiceIndex] = value;
    setProblemList(updated);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const patchData = problemList.map((p) => ({
        question: p.question,
        choices: p.questionType === "MULTIPLE_CHOICE" ? p.choicesArray.join(",") : null,
        answer: p.answer,
        questionType: p.questionType,
      }));

      await updateProblems(token, memberId, workbookId, patchData);

      alert("문제가 성공적으로 수정되었습니다.");
      navigate("/explore");
    } catch (err) {
      console.error("문제 수정 실패:", err);
      alert("문제 수정에 실패했습니다.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="editworkbook-page">
      {isSubmitting && (
        <div className="loading-overlay">
          <div className="spinner" />
          <p>저장 중입니다...</p>
        </div>
      )}

      <div className="editworkbook-header">
        <h1 className="editworkbook-title">{workbookMeta.title} 문제 수정</h1>
      </div>

      <div className="editworkbook-main">
        <div className="editworkbook-content">
          {problemList.map((problem, i) => (
            <div key={problem.problemId} className="editworkbook-problem">
              <h2 className="editworkbook-problem-title">
                문제 {problem.sequenceNumber}번
              </h2>

              <label className="editworkbook-label">문제</label>
              <input
                type="text"
                className="editworkbook-short-answer-input"
                placeholder="문제 내용"
                value={problem.question}
                onChange={(e) => handleQuestionChange(i, e.target.value)}
              />

              {problem.questionType === "MULTIPLE_CHOICE" && (
                <>
                  {problem.choicesArray.map((choice, j) => (
                    <div key={j}>
                      <label className="editworkbook-label">선택지 {j + 1}</label>
                      <input
                        type="text"
                        className="editworkbook-short-answer-input"
                        placeholder={`선택지 ${j + 1}`}
                        value={choice}
                        onChange={(e) => handleChoiceChange(i, j, e.target.value)}
                      />
                    </div>
                  ))}

                  <label className="editworkbook-label">정답</label>
                  <input
                    type="number"
                    min="1"
                    max="4"
                    className="editworkbook-short-answer-input"
                    placeholder="정답 번호 (1~4)"
                    value={problem.answer}
                    onChange={(e) => handleAnswerChange(i, e.target.value)}
                  />
                </>
              )}

              {problem.questionType === "TRUE_FALSE" && (
                <>
                  <label className="editworkbook-label">정답</label>
                  <div className="editworkbook-answer-options">
                    {["O", "X"].map((val) => (
                      <label key={val} className="editworkbook-answer-option">
                        <input
                          type="radio"
                          name={`true-false-${i}`}
                          value={val}
                          checked={problem.answer === val}
                          onChange={() => handleAnswerChange(i, val)}
                          className="editworkbook-answer-input"
                        />
                        <span>{val}</span>
                      </label>
                    ))}
                  </div>
                </>
              )}

              {problem.questionType === "SHORT_ANSWER" && (
                <>
                  <label className="editworkbook-label">정답</label>
                  <input
                    type="text"
                    className="editworkbook-short-answer-input"
                    placeholder="정답 입력"
                    value={problem.answer}
                    onChange={(e) => handleAnswerChange(i, e.target.value)}
                  />
                </>
              )}
            </div>
          ))}

          <button onClick={handleSubmit} className="editworkbook-submit-button">
            수정 사항 저장하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditWorkBook;