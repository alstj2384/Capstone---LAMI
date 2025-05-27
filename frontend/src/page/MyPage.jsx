import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SquirrelIcon from "../assets/DALAMI_2.svg";
import { endpoints } from "../url";
import "./css/MyPage.css";

const MyPage = ({ isLoggedIn }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [reviewList, setReviewList] = useState([]);
  const [problemList, setProblemList] = useState([]);
  const [timeSpent, setTimeSpent] = useState(() =>
    parseInt(localStorage.getItem("timeSpent") || "0")
  );
  const [challengeDays, setChallengeDays] = useState(() =>
    parseInt(localStorage.getItem("challengeDays") || "0")
  );

  useEffect(() => {
    const memberId = localStorage.getItem("memberId");
    const token = localStorage.getItem("token");

    const fetchUserData = async () => {
      try {
        const userRes = await axios.get(endpoints.getUserInfo(memberId), {
          headers: {
            "X-User-ID": memberId,
          },
        });
        setUser(userRes.data.data);

        const reviewRes = await axios.get(endpoints.getReview, {
          headers: {
            Authorization: `${token}`,
            "X-User-ID": memberId,
          },
        });
        setReviewList(reviewRes.data.data || []);

        const workbookRes = await axios.get(endpoints.getWorkbookList, {
          headers: {
            Authorization: `${token}`,
            "X-User-ID": id,
          },
        });
        setProblemList(workbookRes.data.data || []);
      } catch (error) {
        console.log("사용자 정보를 불러올 수 없습니다.");
      }
    };

    fetchUserData();
  }, []);

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

  const formatTime = (seconds) => {
    const hours = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${hours}:${mins}:${secs}`;
  };

  const handleSolve = (quizSetId) => {
    navigate(`/solve/${quizSetId}`);
  };

  if (!isLoggedIn) {
    alert("로그인 화면으로 이동합니다.");
    navigate("/login");
    return null;
  }

  if (!user) {
    return <p className="mypage-loading">사용자 정보를 불러오는 중입니다...</p>;
  }

  return (
    <div className="mypage-page">
      <div className="mypage-container">
        <div className="mypage-header">
          <div className="mypage-profile-section">
            <img
              src={user.profilePic || SquirrelIcon}
              alt="Profile"
              className="mypage-profile-pic"
            />
            <div className="mypage-user-info">
              <h1 className="mypage-user-name">{user.name}</h1>
              <p className="mypage-user-email">{user.email}</p>
              <p className="mypage-user-stats">
                문제집 {problemList.length}개 | 챌린지 {challengeDays}일
              </p>
              <button
                onClick={() => navigate("/edit-mypage")}
                className="mypage-edit-button"
              >
                ✏️ 내 정보 수정
              </button>
            </div>
          </div>
        </div>

        <div className="mypage-main">
          <div className="mypage-today-review">
            <h2 className="mypage-section-title">오늘의 복습</h2>
            <div className="mypage-review-list">
              {reviewList.map((review) => (
                <div key={review.id} className="mypage-review-item">
                  <div className="mypage-review-info">
                    <span className="mypage-review-title">{review.title}</span>
                    <span className="mypage-review-date">
                      {review.createdDate} 생성
                    </span>
                  </div>
                  <button
                    className="mypage-review-button"
                    onClick={() => handleSolve(review.id)}
                  >
                    풀어보기
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mypage-problem-section">
            <h2 className="mypage-section-title">내가 생성한 문제집</h2>
            <div className="mypage-problem-list">
              {problemList.map((problem, idx) => (
                <div key={idx} className="mypage-problem-item">
                  <div className="mypage-problem-title">{problem.title}</div>
                  <div className="mypage-problem-date">{problem.date}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mypage-footer">
          <div className="mypage-section">
            <h2 className="mypage-section-title">접속시간</h2>
            <p className="mypage-section-content">{formatTime(timeSpent)}</p>
          </div>
          <div className="mypage-section">
            <h2 className="mypage-section-title">챌린지</h2>
            <p className="mypage-section-content">{challengeDays}일</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
