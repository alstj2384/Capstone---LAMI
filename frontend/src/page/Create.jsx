import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { generateAiWorkbook, getMyWorkbookList } from "../api"; // AI 문제집 생성 API
import "./css/Create.css";

const Create = () => {
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [file, setFile] = useState(null);
  const [multipleChoiceCount, setMultipleChoiceCount] = useState(0);
  const [trueFalseCount, setTrueFalseCount] = useState(0);
  const [shortAnswerCount, setShortAnswerCount] = useState(0);
  const [isAccuracyConfirmed, setIsAccuracyConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    validateAndSetFile(selectedFile);
  };

  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  const validateAndSetFile = (file) => {
    if (
      file &&
      file.type === "application/pdf" &&
      file.size <= 3 * 1024 * 1024
    ) {
      setFile(file);
    } else {
      alert("PDF 파일만 업로드 가능하며, 최대 3MB까지 허용됩니다.");
    }
  };

  const totalQuestions =
    multipleChoiceCount + trueFalseCount + shortAnswerCount;
  const isTotalQuestionsValid = totalQuestions === 10;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title) return alert("문제집 이름을 입력해주세요.");
    if (!difficulty) return alert("난이도를 선택해주세요.");
    if (!file) return alert("PDF 파일을 업로드해주세요.");
    if (!isTotalQuestionsValid) return alert("문제 수는 총 10개여야 합니다.");
    if (!isAccuracyConfirmed)
      return alert("정답 정확성 확인 체크박스를 선택해주세요.");

    const token = localStorage.getItem("token");
    const memberId = localStorage.getItem("memberId");

    if (!token || !memberId) {
      alert("로그인이 필요합니다.");
      return;
    }

    setIsLoading(true);

    try {
      // 문제집 생성
      const response = await generateAiWorkbook({
        pdf: file,
        title,
        isPublic: "True",
        script: `${title} 문제집 설명입니다.`,
        difficulty,
        multiple: multipleChoiceCount,
        ox: trueFalseCount,
        short: shortAnswerCount,
        token,
        memberId,
      });

      console.log("✅ 문제 생성 응답:", response);

      // 문제집 목록 조회 후 title로 찾기
      const workbookList = await getMyWorkbookList(memberId, token);
      const matched = workbookList.find((wb) => wb.title === title);

      if (matched?.workbookId) {
        navigate("/share-complete", {
          state: { workbookId: matched.workbookId },
        });
      } else {
        alert("문제집은 생성되었지만 ID를 찾을 수 없습니다.");
      }
    } catch (err) {
      alert(err.response?.data?.message || "문제집 생성 중 오류 발생");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-page">
      <div className="create-container">
        <h1 className="create-title">문제 생성하기</h1>
        <form onSubmit={handleSubmit}>
          {/* 제목 입력 */}
          <div className="create-field">
            <label className="create-label">문제집 이름</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="생성할 문제집의 제목을 입력하세요."
              className="create-input"
            />
          </div>

          {/* PDF 업로드 */}
          <div className="create-field">
            <label className="create-label">PDF 업로드</label>
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={handleFileClick}
              className="create-file-upload"
            >
              <p className="create-file-text">
                {file ? file.name : "링크 또는 PDF 드래그 앤 드롭 (최대 3MB)"}
              </p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="application/pdf"
                className="create-file-input"
              />
            </div>
          </div>

          {/* 난이도 선택 */}
          <div className="create-field">
            <label className="create-label">난이도</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="create-select"
            >
              <option value="">선택하세요</option>
              <option value="1">상</option>
              <option value="2">중</option>
              <option value="3">하</option>
            </select>
          </div>

          {/* 문제 개수 설정 */}
          <div className="create-field">
            <label className="create-label">문제 유형별 개수</label>
            <div className="create-question-counts">
              <div className="create-subfield">
                <label className="create-sublabel">객관식</label>
                <select
                  value={multipleChoiceCount}
                  onChange={(e) =>
                    setMultipleChoiceCount(Number(e.target.value))
                  }
                  className="create-subselect"
                >
                  {[...Array(11).keys()].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>
              <div className="create-subfield">
                <label className="create-sublabel">O/X</label>
                <select
                  value={trueFalseCount}
                  onChange={(e) => setTrueFalseCount(Number(e.target.value))}
                  className="create-subselect"
                >
                  {[...Array(11).keys()].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>
              <div className="create-subfield">
                <label className="create-sublabel">단답형</label>
                <select
                  value={shortAnswerCount}
                  onChange={(e) => setShortAnswerCount(Number(e.target.value))}
                  className="create-subselect"
                >
                  {[...Array(11).keys()].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {!isTotalQuestionsValid && (
              <p className="create-error-text">
                총 문제 수는 10개여야 합니다. (현재: {totalQuestions}개)
              </p>
            )}
          </div>

          {/* 정확성 확인 */}
          <div className="create-field">
            <label className="create-checkbox-label">
              <input
                type="checkbox"
                checked={isAccuracyConfirmed}
                onChange={(e) => setIsAccuracyConfirmed(e.target.checked)}
                className="create-checkbox"
              />
              <span>생성된 문제의 정답은 정확하지 않을 수 있습니다.</span>
            </label>
          </div>

          {/* 제출 버튼 */}
          <button
            type="submit"
            className="create-submit-button"
            disabled={!isAccuracyConfirmed || isLoading}
          >
            {isLoading ? "생성 중..." : "생성하기"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Create;
