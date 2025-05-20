import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./css/Create.css"; // CSS 파일 임포트

const Create = () => {
  // 상태 관리
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [file, setFile] = useState(null);
  const [multipleChoiceCount, setMultipleChoiceCount] = useState(0);
  const [trueFalseCount, setTrueFalseCount] = useState(0);
  const [shortAnswerCount, setShortAnswerCount] = useState(0);
  const [isAccuracyConfirmed, setIsAccuracyConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가

  // 페이지 이동을 위한 useNavigate
  const navigate = useNavigate();

  // 파일 입력 참조
  const fileInputRef = useRef(null);

  // 드래그 앤 드롭 이벤트 처리
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files[0];
    if (
      droppedFile &&
      droppedFile.type === "application/pdf" &&
      droppedFile.size <= 3 * 1024 * 1024
    ) {
      setFile(droppedFile);
    } else {
      alert("PDF 파일만 업로드 가능하며, 최대 3MB까지 허용됩니다.");
    }
  };

  // 파일 선택 이벤트 처리
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (
      selectedFile &&
      selectedFile.type === "application/pdf" &&
      selectedFile.size <= 3 * 1024 * 1024
    ) {
      setFile(selectedFile);
    } else {
      alert("PDF 파일만 업로드 가능하며, 최대 3MB까지 허용됩니다.");
    }
  };

  // 파일 입력창 열기
  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  // 문제 수 검증
  const totalQuestions =
    multipleChoiceCount + trueFalseCount + shortAnswerCount;
  const isTotalQuestionsValid = totalQuestions === 10;

  // 폼 제출 처리
  const handleSubmit = (e) => {
    e.preventDefault();
    // 입력 검증
    if (!title) {
      alert("문제집 이름을 입력해주세요.");
      return;
    }
    if (!difficulty) {
      alert("난이도를 선택해주세요.");
      return;
    }
    if (!file) {
      alert("PDF 파일을 업로드해주세요.");
      return;
    }
    if (!isTotalQuestionsValid) {
      alert("문제 수는 총 10개여야 합니다.");
      return;
    }
    if (!isAccuracyConfirmed) {
      alert("정답 정확성 확인 체크박스를 선택해주세요.");
      return;
    }

    // 로딩 상태 표시
    setIsLoading(true);
    // 페이지 이동
    setTimeout(() => {
      navigate("/share-complete");
      setIsLoading(false);
    }, 500); // 0.5초 로딩 후 이동 (사용자 경험 개선)
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
              <svg
                className="create-file-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                ></path>
              </svg>
              <p className="create-file-text">
                {file ? file.name : "Link or drag and drop PDF (max. 3MB)"}
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
              <option value="상">상</option>
              <option value="중">중</option>
              <option value="하">하</option>
            </select>
          </div>

          {/* 문제 스크립트 */}
          <div className="create-field">
            <label className="create-label">문제 스크립트</label>
            <div className="create-question-counts">
              <div className="create-subfield">
                <label className="create-sublabel">객관식 문제 수</label>
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
                <label className="create-sublabel">O/X 문제 수</label>
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
                <label className="create-sublabel">단답형 문제 개수</label>
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

          {/* 정답 정확성 확인 체크박스 */}
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

          {/* 생성 버튼 */}
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
