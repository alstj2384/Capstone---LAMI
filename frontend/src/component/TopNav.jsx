import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LogoImg from "../assets/LAMI_icon.svg";
import "./TopNav.css";
import { getUserInfo, logoutUser as logoutUserAPI } from "../api";

const TopNav = ({ isLoggedIn, user, logoutUser }) => {
  const [userInfo, setUserInfo] = useState(user);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("token");
      const memberId = localStorage.getItem("memberId");
      if (isLoggedIn && token && memberId) {
        try {
          const res = await getUserInfo(memberId, token);
          setUserInfo({
            userId: res.data?.userId || user.userId,
            name: res.data?.name || user.name,
            email: res.data?.email || user.email,
            // profilePic: res.data?.profileImage || user.profilePic,
          });
        } catch (err) {
          console.error("유저 정보 불러오기 실패:", err);
        }
      }
    };

    fetchUserInfo();
  }, [isLoggedIn]);

  return (
    <nav className="top-nav">
      <Link to="/" className="nav-icon-link">
        <img src={LogoImg} className="nav-icon" alt="LAMI Logo" />
      </Link>
      <div className="topnav-text">
        <Link to="/explore" className="nav-button">
          조회
        </Link>
      </div>
      <div className="topnav-text">
        <Link to="/create" className="nav-button">
          생성
        </Link>
      </div>
      <div className="topnav-text">
        <Link to="/review" className="nav-button">
          복습
        </Link>
      </div>
      <div className="topnav-text">
        <Link to="/mypage" className="nav-button">
          마이페이지
        </Link>
      </div>
      {isLoggedIn ? (
        <div className="topnav-text flex items-center space-x-2">
          <img
            src={userInfo?.profilePic}
            alt="Profile"
            className="profile-pic w-8 h-8 rounded-full"
          />
          <span className="text-sm">{userInfo?.name}님 반갑습니다</span>
          <button
            onClick={async () => {
              try {
                const token = localStorage.getItem("token");
                const memberId = localStorage.getItem("memberId");
                await logoutUserAPI(token, memberId); // 실제 API 호출
                logoutUser();
              } catch (err) {
                console.error("로그아웃 실패", err);
              }
            }}
            className="nav-button bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
          >
            로그아웃
          </button>
        </div>
      ) : (
        <>
          <div className="topnav-text">
            <Link to="/login" className="nav-button">
              로그인
            </Link>
          </div>
          <div className="topnav-text">
            <Link to="/signup" className="nav-button">
              회원가입
            </Link>
          </div>
        </>
      )}
    </nav>
  );
};

export default TopNav;
