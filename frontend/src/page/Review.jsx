import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SquirrelIcon from "../assets/DALAMI_2.svg"; // 아이콘 임포트 (실제 경로로 대체 필요)
import "./css/Review.css";

const Review = () => {
  const navigate = useNavigate();

  // 과목 목록
  const subjects = [
    { id: 1, name: "정보처리기사", problemCount: 20 },
    { id: 2, name: "리눅스 마스터 2급", problemCount: 15 },
    { id: 3, name: "컴퓨터 네트워크", problemCount: 10 },
    { id: 4, name: "한국사 검정 시험", problemCount: 15 },
    { id: 5, name: "건축 설비 기사", problemCount: 50 },
  ];

  // 문제집 데이터 (과목별) - 일부 과목에 4개 이상 문제집 추가
  const problemSets = {
    1: [
      { id: 1, title: "정보처리기사 2회", date: "25.04.01. 생성" },
      { id: 2, title: "정보처리기사 3회", date: "25.04.02. 생성" },
      { id: 3, title: "정보처리기사 4회", date: "25.04.03. 생성" },
      { id: 4, title: "정보처리기사 5회", date: "25.04.04. 생성" },
      { id: 5, title: "정보처리기사 6회", date: "25.04.05. 생성" },
      { id: 6, title: "정보처리기사 7회", date: "25.04.06. 생성" },
    ],
    2: [
      { id: 7, title: "리눅스 마스터 2급", date: "25.04.03. 생성" },
      { id: 8, title: "리눅스 마스터 2급", date: "25.04.04. 생성" },
    ],
    3: [
      { id: 9, title: "컴퓨터 네트워크 1회", date: "25.04.05. 생성" },
      { id: 10, title: "컴퓨터 네트워크 2회", date: "25.04.06. 생성" },
      { id: 11, title: "컴퓨터 네트워크 3회", date: "25.04.07. 생성" },
    ],
    4: [
      { id: 12, title: "한국사 검정 시험 1회", date: "25.04.07. 생성" },
      { id: 13, title: "한국사 검정 시험 2회", date: "25.04.08. 생성" },
      { id: 14, title: "한국사 검정 시험 3회", date: "25.04.09. 생성" },
      { id: 15, title: "한국사 검정 시험 4회", date: "25.04.10. 생성" },
      { id: 16, title: "한국사 검정 시험 5회", date: "25.04.11. 생성" },
    ],
    5: [
      { id: 17, title: "건축 설비 기사 1회", date: "25.04.09. 생성" },
      { id: 18, title: "건축 설비 기사 2회", date: "25.04.10. 생성" },
      { id: 19, title: "건축 설비 기사 3회", date: "25.04.11. 생성" },
    ],
  };

  // 선택된 과목 및 페이지 상태
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // 과목 클릭 핸들러
  const handleSubjectClick = (subjectId) => {
    setSelectedSubject(subjectId);
    setCurrentPage(1); // 과목 변경 시 페이지를 초기화
  };

  // "풀어보기" 버튼 클릭 핸들러
  const handleSolve = () => {
    navigate("/solve");
  };

  // 페이지네이션 계산
  const currentProblemSets = selectedSubject
    ? problemSets[selectedSubject]
    : [];
  const totalPages = Math.ceil(currentProblemSets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedProblemSets = currentProblemSets.slice(startIndex, endIndex);

  // 빈 박스 추가 (4개 유지)
  const emptySlots = 4 - displayedProblemSets.length;
  const emptyBoxes = Array.from({ length: emptySlots }, (_, index) => (
    <div key={`empty-${index}`} className="review-problem-set-empty"></div>
  ));

  // 페이지 변경 핸들러
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0); // 페이지 변경 시 상단으로 스크롤
  };

  return (
    <div className="review-page">
      <div className="review-container">
        <h1 className="review-title">오늘의 복습</h1>
        <div className="review-main">
          {/* 좌측: 과목 목록 */}
          <div className="review-subjects">
            {subjects.map((subject) => (
              <div
                key={subject.id}
                className={`review-subject ${
                  selectedSubject === subject.id ? "review-subject-active" : ""
                }`}
                onClick={() => handleSubjectClick(subject.id)}
              >
                <h2 className="review-subject-title">{subject.name}</h2>
                <p className="review-subject-count">
                  복습 문제: {subject.problemCount}
                </p>
              </div>
            ))}
          </div>

          {/* 우측: 문제집 목록 */}
          <div className="review-problem-sets">
            {selectedSubject ? (
              displayedProblemSets.length > 0 ? (
                <>
                  {displayedProblemSets.map((problemSet) => (
                    <div key={problemSet.id} className="review-problem-set">
                      <img
                        src={SquirrelIcon}
                        alt="Squirrel Icon"
                        className="review-problem-set-icon"
                      />
                      <h3 className="review-problem-set-title">
                        {problemSet.title}
                      </h3>
                      <p className="review-problem-set-date">
                        {problemSet.date}
                      </p>
                      <button
                        onClick={handleSolve}
                        className="review-problem-set-button"
                      >
                        풀어보기
                      </button>
                    </div>
                  ))}
                  {emptyBoxes}
                </>
              ) : (
                <p className="review-empty">해당 과목에 문제집이 없습니다.</p>
              )
            ) : (
              <p className="review-empty">과목을 선택해주세요.</p>
            )}
            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <div className="review-pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="review-pagination-button"
                >
                  Previous
                </button>
                {[...Array(totalPages).keys()].map((page) => (
                  <button
                    key={page + 1}
                    onClick={() => handlePageChange(page + 1)}
                    className={`review-pagination-button ${
                      currentPage === page + 1
                        ? "review-pagination-button-active"
                        : ""
                    }`}
                  >
                    {page + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="review-pagination-button"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Review;
