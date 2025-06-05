import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axiosInstance";
import SquirrelIcon from "../assets/DALAMI_2.svg";
import { endpoints } from "../url";
import { useSelector } from "react-redux";
import "./css/MyPage.css";

const MyPage = () => {
  const navigate = useNavigate();

  const { token, memberId, isLoggedIn, isInitialized } = useSelector(
    (state) => state.auth
  );

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
    if (!isInitialized) return;
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    const fetchUserData = async () => {
      const config = {
        headers: {
          Authorization: `${token}`,
          "X-User-ID": memberId,
        },
      };

      try {
        const userRes = await axios.get(
          endpoints.getUserInfo(memberId),
          config
        );
        const userData = userRes?.data?.data || userRes?.data;
        setUser(userData);

        const reviewRes = await axios.get(endpoints.getReview, config);
        const reviews = reviewRes.data?.data;
        setReviewList(Array.isArray(reviews) ? reviews : []);

        const workbookRes = await axios.get(endpoints.getWorkbookList, config);
        const workbooks = workbookRes.data?.data;
        setProblemList(Array.isArray(workbooks) ? workbooks : []);
      } catch (error) {
        console.error("사용자 정보를 불러올 수 없습니다.", error);
      }
    };

    fetchUserData();
  }, [isInitialized, isLoggedIn, token, memberId, navigate]);

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

  if (!isInitialized) {
    return <p className="mypage-loading">초기화 중입니다...</p>;
  }

  if (!user) {
    return <p className="mypage-loading">사용자 정보를 불러오는 중입니다...</p>;
  }

  return (
    <div className="mypage-page">
      <div className="mypage-container">
        {/* 프로필 섹션 */}
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
          {/* 총 푼 문제 수 */}
          <div className="mypage-review-summary">
            <h2 className="mypage-section-title">총 푼 문제 수</h2>
            <p className="mypage-section-content">{user.solvedCount ?? 12}개</p>
          </div>

          {/* 선호 암기법 / 피드백 스타일 */}
          <div className="mypage-preference-summary">
            <h2 className="mypage-section-title">나의 학습 설정</h2>
            <p className="mypage-section-content">
              암기법:{" "}
              {user.memorizationMethod === "StorytellingMethod"
                ? "이야기 기반 암기법"
                : user.memorizationMethod === "AssociationMethod"
                ? "연상 암기법"
                : "어휘 연결 암기법"}
            </p>
            <p className="mypage-section-content">
              피드백:{" "}
              {user.feedbackStyle === "GENTLE_FEEDBACK"
                ? "부드러운 피드백"
                : user.feedbackStyle === "DETAILED_FEEDBACK"
                ? "자세한 설명"
                : "긍정적인 피드백"}
            </p>
          </div>
        </div>

        {/* 하단 */}
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
