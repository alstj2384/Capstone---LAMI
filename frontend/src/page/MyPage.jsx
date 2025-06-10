import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axiosInstance";
import SquirrelIcon from "../assets/DALAMI_2.svg";
import { endpoints } from "../url";
import { useSelector } from "react-redux";
import { getWorkbook, getMyWorkbookList, getGradingList } from "../api";
import "./css/MyPage.css";

const MyPage = () => {
  const navigate = useNavigate();

  const { token, memberId, isLoggedIn, isInitialized } = useSelector(
    (state) => state.auth
  );

  const [user, setUser] = useState(null);
  const [myWorkbooks, setMyWorkbooks] = useState([]);
  const [problemList, setProblemList] = useState([]);
  const [reviewList, setReviewList] = useState([]);
  const [timeSpent, setTimeSpent] = useState(() =>
    parseInt(localStorage.getItem("timeSpent") || "0")
  );
  const [gradedCount, setGradedCount] = useState(0);

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

        const myWorkbooks = await getMyWorkbookList(memberId, token);

        const detailedWorkbooks = await Promise.all(
          myWorkbooks.map(async (wb) => {
            try {
              const detail = await getWorkbook(wb.workbookId);
              return {
                ...wb,
                questionAmount: detail?.data?.questionAmount ?? 0,
              };
            } catch (err) {
              console.error(`문제집 ${wb.workbookId} 조회 실패`, err);
              return {
                ...wb,
                questionAmount: 0,
              };
            }
          })
        );

        setMyWorkbooks(detailedWorkbooks);

        const gradingRes = await getGradingList(token, memberId);
        const gradingList = gradingRes?.data?.gradingList || [];
        setGradedCount(gradingList.length);

        console.log("📄 MyPage에서 받은 문제집 목록:", myWorkbooks);
      } catch (error) {
        console.error("❌ 사용자 정보를 불러올 수 없습니다.", error);
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

  const getDifficultyText = (difficulty) => {
    switch (difficulty) {
      case 1:
        return "높음";
      case 2:
        return "중간";
      case 3:
        return "낮음";
      default:
        return "없음";
    }
  };

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
              <button
                onClick={() => navigate("/edit-mypage")}
                className="mypage-edit-button"
              >
                ✏️ 내 정보 수정
              </button>
            </div>
          </div>
        </div>

        {/* 내가 만든 문제집 리스트 */}
        <div className="mypage-myworkbook-section">
          <h2 className="mypage-section-title">내가 만든 문제집</h2>
          <div className="mypage-problem-list">
            {myWorkbooks.length === 0 ? (
              <p className="mypage-section-content">문제집이 없습니다.</p>
            ) : (
              myWorkbooks.map((workbook) => (
                <div
                  key={workbook.workbookId}
                  className="mypage-problem-item"
                  onClick={() => handleSolve(workbook.workbookId)}
                >
                  <div className="mypage-problem-title">{workbook.title}</div>
                  <div className="mypage-problem-meta">
                    난이도: {getDifficultyText(workbook.difficulty)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 하단 */}
        <div className="mypage-footer">
          <div className="mypage-section">
            <h2 className="mypage-section-title">접속시간</h2>
            <p className="mypage-section-content">{formatTime(timeSpent)}</p>
          </div>
          <div className="mypage-section">
            <h2 className="mypage-section-title">채점 완료한 문제집</h2>
            <p className="mypage-section-content">{gradedCount}개</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
