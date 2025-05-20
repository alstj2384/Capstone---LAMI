import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SquirrelIcon from "../assets/DALAMI_2.svg";
import { endpoints } from "../url"; // 추가
import "./css/MyPage.css";

const MyPage = ({ isLoggedIn }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null); // 사용자 정보 상태 추가
  const [timeSpent, setTimeSpent] = useState(() => {
    const savedTime = localStorage.getItem("timeSpent");
    return savedTime ? parseInt(savedTime) : 0;
  });
  const [challengeDays, setChallengeDays] = useState(() => {
    const savedDays = localStorage.getItem("challengeDays");
    return savedDays ? parseInt(savedDays) : 0;
  });

  // 하드코딩 데이터 생략
  const myProblemSets = [
    /* ... */
  ];
  const todayReviewSets = [
    /* ... */
  ];

  // 🔸 사용자 정보 API 호출
  useEffect(() => {
    const fetchUserInfo = async () => {
      const memberId = localStorage.getItem("memberId");
      if (!memberId) {
        alert("회원 정보를 찾을 수 없습니다. 다시 로그인해주세요.");
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(endpoints.getUserInfo(memberId));
        if (response.status === 200 && response.data.status === 200) {
          setUser(response.data.data);
        } else {
          throw new Error("회원 정보 조회 실패");
        }
      } catch (err) {
        alert("회원 정보를 불러오지 못했습니다.");
        navigate("/login");
      }
    };

    fetchUserInfo();
  }, [navigate]);

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

  const handleSolve = () => {
    navigate("/solve");
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
        {/* 프로필 섹션 */}
        <div className="mypage-header">
          <div className="mypage-profile-section">
            <img
              src={SquirrelIcon}
              alt="Profile"
              className="mypage-profile-pic"
            />
            <div className="mypage-user-info">
              <h1 className="mypage-user-name">{user.name}</h1>
              <p className="mypage-user-email">{user.email}</p>
              <p className="mypage-user-stats">
                생성한 문제집: {myProblemSets.length}개 | 챌린지:{" "}
                {challengeDays}일
              </p>
            </div>
          </div>
          {/* 암기법 등 나머지 UI 유지 */}
        </div>

        {/* 이하 생략된 복습/문제집 영역 그대로 유지 */}
      </div>
    </div>
  );
};

export default MyPage;
