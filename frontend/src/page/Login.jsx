import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api";
import LogoImg from "../assets/LAMI_icon.svg";
import { useDispatch } from 'react-redux';
import { login } from '../redux/authSlice'; // redux로부터 login action

export default function Login() {
  const dispatch = useDispatch(); // redux용 dispatch 사용
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { memberId, token } = await loginUser({ userId, password });

      dispatch(login({ memberId, token })); // redux 상태 저장
      navigate("/");
    } catch (err) {
      console.error("로그인 에러:", err);
      const errorMessage =
        err.response?.data?.message ||
        "아이디 또는 비밀번호가 올바르지 않습니다.";
      setError(errorMessage);
    }
  };


  return (
    <div className="flex justify-center bg-white min-h-screen">
      <form onSubmit={handleSubmit} className="w-full max-w-md p-6 mt-12">
        <div className="flex justify-center mb-4">
          <img src={LogoImg} alt="LAMI Logo" className="w-16 h-16" />
        </div>
        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
          로그인
        </h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="아이디"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            type="submit"
            className="w-full bg-primaryGreen text-white py-2 rounded-md font-medium transition duration-200"
          >
            로그인
          </button>
          <Link
            to="/signup"
            className="w-full block bg-gray-300 text-black py-2 rounded-md font-medium text-center transition duration-200"
          >
            회원가입
          </Link>
        </div>
      </form>
    </div>
  );
}
