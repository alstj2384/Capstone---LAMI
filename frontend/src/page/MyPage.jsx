import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SquirrelIcon from "../assets/DALAMI_2.svg"; // 더미 프로필 사진
import "./css/MyPage.css";

const MyPage = ({ isLoggedIn, user }) => {
  const navigate = useNavigate();

  // 접속시간 상태
  const [timeSpent, setTimeSpent] = useState(() => {
    const savedTime = localStorage.getItem("timeSpent");
    return savedTime ? parseInt(savedTime) : 0;
  });

  // 챌린지 상태
  const [challengeDays, setChallengeDays] = useState(() => {
    const savedDays = localStorage.getItem("challengeDays");
    return savedDays ? parseInt(savedDays) : 0;
  });

  // 내가 생성한 문제집 (하드코딩 데이터)
  const myProblemSets = [
    { id: 1, title: "철학선지리기사 2회", date: "25.04.01. 생성" },
    { id: 2, title: "리눅스 O 명명어 1회", date: "25.04.03. 생성" },
    { id: 3, title: "컴퓨터 네트워크 1회", date: "25.04.05. 생성" },
    { id: 4, title: "한국사 감경 시험 1회", date: "25.04.07. 생성" },
    { id: 5, title: "건축 설비 기사 1회", date: "25.04.09. 생성" },
  ];

  // 오늘의 복습 문제집 (하드코딩 데이터)
  const todayReviewSets = [
    { id: 1, title: "철학선지리기사 3회", date: "25.04.02. 생성" },
    { id: 2, title: "리눅스 O 명명어 2회", date: "25.04.04. 생성" },
    { id: 3, title: "컴퓨터 네트워크 2회", date: "25.04.06. 생성" },
  ];

  // 접속시간 타이머
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent((prev) => {
        const newTime = prev + 1;
        localStorage.setItem("timeSpent", newTime.toString());
        return newTime;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 시간 포맷팅 (HH:MM:SS)
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

  // "풀어보기" 버튼 클릭 핸들러
  const handleSolve = () => {
    navigate("/solve");
  };

  // 로그인 상태가 false일 경우에만 리다이렉트
  if (!isLoggedIn) {
    alert("로그인 화면으로 이동합니다.");
    navigate("/login");
    return null;
  }

  return (
    <div className="mypage-page">
      <div className="mypage-container">
        {/* 상단: 프로필 및 암기법 */}
        <div className="mypage-header">
          {/* 프로필 사진 및 사용자 정보 */}
          <div className="mypage-profile-section">
            <img
              src={SquirrelIcon}
              alt="Profile"
              className="mypage-profile-pic"
            />
            <div className="mypage-user-info">
              <h1 className="mypage-user-name">{user?.username || "사용자"}</h1>
              <p className="mypage-user-email">
                {user?.email || "user@example.com"}
              </p>
              <p className="mypage-user-stats">
                생성한 문제집: {myProblemSets.length}개 | 챌린지:{" "}
                {challengeDays}일
              </p>
            </div>
          </div>

          {/* 암기법 (비워둠) */}
          <div className="mypage-section mypage-memo-section">
            <h2 className="mypage-section-title">암기법</h2>
            {/* 내용은 이후 추가 예정 */}
          </div>
        </div>

        {/* 중단: 오늘의 복습 및 내가 생성한 문제집 */}
        <div className="mypage-main">
          {/* 오늘의 복습 */}
          <div className="mypage-section mypage-today-review">
            <h2 className="mypage-section-title">오늘의 복습</h2>
            <div className="mypage-review-list">
              {todayReviewSets.map((reviewSet) => (
                <div key={reviewSet.id} className="mypage-review-item">
                  <div className="mypage-review-info">
                    <span className="mypage-review-title">
                      {reviewSet.title}
                    </span>
                    <span className="mypage-review-date">{reviewSet.date}</span>
                  </div>
                  <button
                    onClick={handleSolve}
                    className="mypage-review-button"
                  >
                    풀어보기
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 내가 생성한 문제집 */}
          <div className="mypage-section mypage-problem-section">
            <h2 className="mypage-section-title">내가 생성한 문제집</h2>
            <div className="mypage-problem-list">
              {myProblemSets.map((problemSet) => (
                <div key={problemSet.id} className="mypage-problem-item">
                  <span className="mypage-problem-title">
                    {problemSet.title}
                  </span>
                  <span className="mypage-problem-date">{problemSet.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 하단: 접속시간 및 챌린지 */}
        <div className="mypage-footer">
          <div className="mypage-section">
            <h2 className="mypage-section-title">접속시간</h2>
            <p className="mypage-section-content">{formatTime(timeSpent)}</p>
          </div>
          <div className="mypage-section">
            <h2 className="mypage-section-title">챌린지</h2>
            <p className="mypage-section-content">{challengeDays}일 연속</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
