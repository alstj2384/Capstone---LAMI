import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SquirrelIcon from "../assets/DALAMI_2.svg"; // 아이콘 임포트 (실제 경로로 대체 필요)
import "./css/Explore.css"; // CSS 파일 임포트

const Explore = () => {
  // 페이지 이동을 위한 useNavigate
  const navigate = useNavigate();

  // 더미 데이터 (난이도와 userId 속성 포함)
  const dummyData = [
    {
      id: 1,
      title: "정보처리기사 2회",
      date: "25.04.01. 생성",
      difficulty: "높음",
      userId: "user123",
    },
    {
      id: 2,
      title: "정보처리기사 3회",
      date: "25.04.01. 생성",
      difficulty: "중간",
      userId: "user456",
    },
    {
      id: 3,
      title: "정보처리기사 4회",
      date: "25.04.01. 생성",
      difficulty: "낮음",
      userId: "user789",
    },
    {
      id: 4,
      title: "정보처리기사 5회",
      date: "25.04.01. 생성",
      difficulty: "높음",
      userId: "user123",
    },
    {
      id: 5,
      title: "정보처리기사 6회",
      date: "25.04.01. 생성",
      difficulty: "중간",
      userId: "user456",
    },
    {
      id: 6,
      title: "정보처리기사 7회",
      date: "25.04.01. 생성",
      difficulty: "낮음",
      userId: "user789",
    },
    {
      id: 7,
      title: "정보처리기사 8회",
      date: "25.04.01. 생성",
      difficulty: "높음",
      userId: "user123",
    },
    {
      id: 8,
      title: "정보처리기사 9회",
      date: "25.04.01. 생성",
      difficulty: "중간",
      userId: "user456",
    },
    {
      id: 9,
      title: "정보처리기사 10회",
      date: "25.04.01. 생성",
      difficulty: "낮음",
      userId: "user789",
    },
    {
      id: 10,
      title: "정보처리기사 11회",
      date: "25.04.01. 생성",
      difficulty: "높음",
      userId: "user123",
    },
    {
      id: 11,
      title: "정보처리기사 12회",
      date: "25.04.01. 생성",
      difficulty: "중간",
      userId: "user456",
    },
    {
      id: 12,
      title: "정보처리기사 13회",
      date: "25.04.01. 생성",
      difficulty: "낮음",
      userId: "user789",
    },
    {
      id: 13,
      title: "정보처리기사 14회",
      date: "25.04.01. 생성",
      difficulty: "높음",
      userId: "user123",
    },
    {
      id: 14,
      title: "정보처리기사 15회",
      date: "25.04.01. 생성",
      difficulty: "중간",
      userId: "user456",
    },
    {
      id: 15,
      title: "정보처리기사 16회",
      date: "25.04.01. 생성",
      difficulty: "낮음",
      userId: "user789",
    },
    {
      id: 16,
      title: "정보처리기사 17회",
      date: "25.04.01. 생성",
      difficulty: "높음",
      userId: "user123",
    },
    {
      id: 17,
      title: "정보처리기사 18회",
      date: "25.04.01. 생성",
      difficulty: "중간",
      userId: "user456",
    },
  ];

  // 현재 사용자 ID (고정값으로 설정, 실제로는 로그인 정보에서 가져올 수 있음)
  const currentUserId = "user123";

  // 검색 및 필터링 상태
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [showMyQuizzes, setShowMyQuizzes] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // 검색 및 난이도 필터링 적용
  const filteredItems = dummyData.filter((item) => {
    const matchesSearch = item.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesDifficulty = selectedDifficulty
      ? item.difficulty === selectedDifficulty
      : true;
    const matchesUser = showMyQuizzes ? item.userId === currentUserId : true;
    return matchesSearch && matchesDifficulty && matchesUser;
  });

  // 페이지네이션
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredItems.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // 페이지네이션 버튼 생성
  const pageNumbers = [];
  const maxPagesToShow = 5;
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handleDifficultyChange = (difficulty) => {
    setSelectedDifficulty(
      difficulty === selectedDifficulty ? null : difficulty
    );
    setCurrentPage(1);
  };

  const handleShowMyQuizzesChange = () => {
    setShowMyQuizzes(!showMyQuizzes);
    setCurrentPage(1);
  };

  // "풀어보기" 버튼 클릭 시 Solve 페이지로 이동
  const handleSolve = () => {
    navigate("/solve");
  };

  return (
    <div className="explore-container">
      {/* 페이지 제목 */}
      <h1 className="explore-title">문제집 둘러보기</h1>

      {/* 검색 및 필터 영역 */}
      <div className="explore-filter-container">
        <div className="explore-input-group">
          <div className="explore-search-wrapper">
            <input
              type="text"
              placeholder="검색 내 문장을 입력하세요."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="explore-input"
            />
            <button onClick={handleSearch} className="explore-search-button">
              검색하기
            </button>
          </div>
          <div className="explore-category-wrapper">
            <input
              type="text"
              placeholder="카테고리"
              className="explore-input explore-input-small"
            />
            <button className="explore-category-button">필터링</button>
          </div>
        </div>
        <div className="explore-right-group">
          <div className="explore-button-group">
            <span className="explore-filter-label">난이도</span>
            <button
              onClick={() => handleDifficultyChange("높음")}
              className={`explore-filter-button ${
                selectedDifficulty === "높음"
                  ? "explore-filter-button-active"
                  : ""
              }`}
            >
              높음
            </button>
            <button
              onClick={() => handleDifficultyChange("중간")}
              className={`explore-filter-button ${
                selectedDifficulty === "중간"
                  ? "explore-filter-button-active"
                  : ""
              }`}
            >
              중간
            </button>
            <button
              onClick={() => handleDifficultyChange("낮음")}
              className={`explore-filter-button ${
                selectedDifficulty === "낮음"
                  ? "explore-filter-button-active"
                  : ""
              }`}
            >
              낮음
            </button>
          </div>
          <div className="explore-checkbox-group">
            <input
              type="checkbox"
              id="my-posts"
              className="explore-checkbox"
              checked={showMyQuizzes}
              onChange={handleShowMyQuizzesChange}
            />
            <label htmlFor="my-posts" className="explore-checkbox-label">
              내가 생성한 문제집 보기
            </label>
          </div>
        </div>
      </div>

      {/* 카드 목록 */}
      <div className="explore-grid">
        {currentItems.length > 0 ? (
          currentItems.map((item) => (
            <div key={item.id} className="explore-card">
              <img
                src={SquirrelIcon}
                alt="Squirrel Icon"
                className="explore-card-icon"
              />
              <h3 className="explore-card-title">{item.title}</h3>
              <p className="explore-card-date">{item.date}</p>
              <button onClick={handleSolve} className="explore-card-button">
                풀어보기
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            검색 결과가 없습니다.
          </p>
        )}
      </div>

      {/* 페이지네이션 */}
      {currentItems.length > 0 && (
        <div className="explore-pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="explore-pagination-button"
          >
            Previous
          </button>
          {startPage > 1 && (
            <span className="explore-pagination-ellipsis">...</span>
          )}
          {pageNumbers.map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`explore-pagination-button ${
                currentPage === page ? "explore-pagination-button-active" : ""
              }`}
            >
              {page}
            </button>
          ))}
          {endPage < totalPages && (
            <span className="explore-pagination-ellipsis">...</span>
          )}
          {endPage < totalPages && (
            <button
              onClick={() => handlePageChange(totalPages)}
              className="explore-pagination-button"
            >
              {totalPages}
            </button>
          )}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="explore-pagination-button"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Explore;
