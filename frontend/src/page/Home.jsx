import React from "react";
import { useNavigate } from "react-router-dom"; // useNavigate 임포트
import "../page/Home.css";

const Home = () => {
  const navigate = useNavigate(); // 네비게이션 훅 사용

  return (
    <div className="home-container">
      <div className="home-content">
        <h1>풀어봐요 라미에서</h1>
        <p>라미에서 쉽게 문제를 만들고 공유할 수 있어요</p>
      </div>
    </div>
  );
};

export default Home;
