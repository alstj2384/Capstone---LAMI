import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginForm.css"; // 별도 CSS 파일 필요 시

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // 하드코딩된 자격 증명 확인
    const HARD_CODED_USERNAME = "admin";
    const HARD_CODED_PASSWORD = "password123";

    if (username === HARD_CODED_USERNAME && password === HARD_CODED_PASSWORD) {
      onLogin({ username, profilePic: "https://via.placeholder.com/40" });
      setError("");
      navigate("/"); // 로그인 성공 시 홈으로 리다이렉트
    } else {
      setError("아이디 또는 비밀번호가 잘못되었습니다.");
    }
  };

  return (
    <div className="flex justify-center mt-20">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-2xl mb-4">로그인</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="아이디"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            로그인
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
