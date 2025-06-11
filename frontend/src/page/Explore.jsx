import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SquirrelIcon from "../assets/DALAMI_2.svg";
import { getWorkbookList } from "../api";
import "./css/Explore.css";

const Explore = () => {
  const navigate = useNavigate();

  const [quizList, setQuizList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [showMyQuizzes, setShowMyQuizzes] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [userNames, setUserNames] = useState({});
  const itemsPerPage = 8;
  const filteredItems = quizList.filter((item) => {
    const matchesSearch = item.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesDifficulty = selectedDifficulty
      ? item.difficulty === selectedDifficulty
      : true;
    const matchesUser = showMyQuizzes ? item.userId === memberId : true;
    return matchesSearch && matchesDifficulty && matchesUser;
  });

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredItems.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  useEffect(() => {
    const fetchData = async () => {
      try {
        const quizRes = await getWorkbookList();
        //console.log(quizRes)
        setQuizList(quizRes.content);
      } catch (error) {
        console.error("데이터를 불러오는 중 오류 발생", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchUserNames = async () => {
      const token = localStorage.getItem("token");
      const newNames = { ...userNames };

      const uniqueUserIds = [
        ...new Set(filteredItems.map((item) => item.userId)),
      ].filter((id) => !newNames[id]); // 아직 불러오지 않은 ID만

      await Promise.all(
        uniqueUserIds.map(async (id) => {
          try {
            const res = await getUserName(id, token);
            newNames[id] = res.nickname || res.name || "알 수 없음";
          } catch (err) {
            console.error(`사용자 ${id} 정보 조회 실패`, err);
            newNames[id] = "알 수 없음";
          }
        })
      );

      setUserNames(newNames);
    };

    if (filteredItems.length > 0) fetchUserNames();
  }, [filteredItems]);

  const memberId = parseInt(localStorage.getItem("memberId") || "", 10);

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

  const handleSearch = () => setCurrentPage(1);

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

  const handleSolve = (quizId) => navigate(`/solve/${quizId}`);
  const handleEditWorkBook = (workbookId) =>
    navigate(`/editworkbook/${workbookId}`);

  return (
    <div className="explore-container">
      <h1 className="explore-title">문제집 둘러보기</h1>

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
        </div>
        <div className="explore-right-group">
          <div className="explore-button-group">
            <span className="explore-filter-label">난이도</span>
            {[
              { label: "낮음", value: 3 },
              { label: "중간", value: 2 },
              { label: "높음", value: 1 },
            ].map(({ label, value }) => (
              <button
                key={label}
                onClick={() => handleDifficultyChange(value)}
                className={`explore-filter-button ${
                  selectedDifficulty === value
                    ? "explore-filter-button-active"
                    : ""
                }`}
              >
                {label}
              </button>
            ))}
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
              내가 생성한 문제집만 보기
            </label>
          </div>
        </div>
      </div>

      <div className="explore-grid">
        {currentItems.length > 0 ? (
          currentItems.map((item) => (
            <div key={item.workbookId} className="explore-card">
              <img
                src={SquirrelIcon}
                alt="Squirrel Icon"
                className="explore-card-icon"
              />
              <h3 className="explore-card-title">{item.title}</h3>
              <p className="explore-card-date">
                작성자: <span className="text-sm font-mono">{item.userId}</span>
              </p>

              <div className="explore-card-button-group">
                <button
                  onClick={() => handleSolve(item.workbookId)}
                  className={`explore-card-button ${
                    item.userId !== memberId ? "full-width" : ""
                  }`}
                >
                  풀어보기
                </button>

                {item.userId === memberId && (
                  <button
                    onClick={() => handleEditWorkBook(item.workbookId)}
                    className="explore-card-edit-button"
                  >
                    수정하기
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            검색 결과가 없습니다.
          </p>
        )}
      </div>

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
            <>
              <span className="explore-pagination-ellipsis">...</span>
              <button
                onClick={() => handlePageChange(totalPages)}
                className="explore-pagination-button"
              >
                {totalPages}
              </button>
            </>
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
