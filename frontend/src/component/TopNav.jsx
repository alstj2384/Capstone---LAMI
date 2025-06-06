import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LogoImg from "../assets/LAMI_icon.svg";
import profile from "../assets/DALAMI_1.svg";
import "./TopNav.css";
import { getUserInfo, logoutUser as logoutUserAPI } from "../api";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";

const TopNav = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux 상태
  const { token, memberId, isLoggedIn, isInitialized } = useSelector(
    (state) => state.auth
  );

  const [userInfo, setUserInfo] = useState(null);

  const fetchUserInfo = async () => {
    if (!memberId || !token) return;

    try {
      const res = await getUserInfo(memberId, token);
      const data = res?.data?.data || res?.data || res;

      setUserInfo({
        userId: data.userId,
        name: data.name,
        email: data.email,
        profilePic: data.profilePic,
      });
    } catch (err) {
      console.error("유저 정보 불러오기 실패", err);
    }
  };

  useEffect(() => {
    if (isInitialized && isLoggedIn && memberId && token) {
      fetchUserInfo();
    }
  }, [isInitialized, isLoggedIn, memberId, token]);

  if (!isInitialized) return null;

  const handleLogout = async () => {
    try {
      await logoutUserAPI(token, memberId);
    } catch (err) {
      console.error("서버 로그아웃 실패", err);
    } finally {
      dispatch(logout());
      navigate("/");
    }
  };

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
        <Link to="/grading-history" className="nav-button">
          채점 기록
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
            src={userInfo?.profilePic || profile}
            alt="Profile"
            className="profile-pic w-8 h-8 rounded-full"
          />
          <span className="text-sm">
            {userInfo?.name ? `${userInfo.name}님 반갑습니다` : ""}
          </span>
          <button
            onClick={handleLogout}
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
