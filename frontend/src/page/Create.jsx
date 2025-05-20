import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { endpoints } from "../url"; // 엔드포인트 정의 필요
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

  const handleFileClick = () => {
    fileInputRef.current.click();
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

    const formData = new FormData();
    formData.append("pdf", file);
    formData.append("title", title);
    formData.append("isPublic", "True");
    formData.append("script", `${title} 문제집 설명입니다.`);
    formData.append("difficulty", difficulty);
    formData.append("multipleChoiceAmount", multipleChoiceCount.toString());
    formData.append("trueFalseAmount", trueFalseCount.toString());
    formData.append("shortAnswerAmount", shortAnswerCount.toString());

    setIsLoading(true);

    try {
      const response = await axios.post(endpoints.createProblemSet, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201 && response.data.status === 201) {
        alert("문제집이 성공적으로 생성되었습니다!");
        navigate("/share-complete");
      } else {
        alert(response.data.message || "문제집 생성 실패");
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
              <option value="1">상</option>
              <option value="2">중</option>
              <option value="3">하</option>
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
