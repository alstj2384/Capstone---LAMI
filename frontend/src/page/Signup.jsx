import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { server, endpoints } from "../url"; // server 변수 사용
import axios from "axios";
import "./css/Signup.css";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userId: "",
    password: "",
    confirmPassword: "",
    name: "",
    emailLocal: "",
    emailDomain: "hanmail.com",
    customDomain: "",
    nickname: "",
    memorizationMethod: "AssociationMethod",
  });

  const [isUserIdAvailable, setIsUserIdAvailable] = useState(null);
  const [userIdMessage, setUserIdMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [passwordMatchError, setPasswordMatchError] = useState(false);

  const emailDomains = [
    "hanmail.com",
    "google.com",
    "naver.com",
    "직접 입력하기",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "userId") {
      setIsUserIdAvailable(null);
      setUserIdMessage("");
    }
    

    if (name === "password" || name === "confirmPassword") {
      const newPassword = name === "password" ? value : formData.password;
      const newConfirmPassword =
        name === "confirmPassword" ? value : formData.confirmPassword;

      setPasswordMatchError(
        newPassword !== newConfirmPassword && newConfirmPassword !== ""
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      userId,
      password,
      confirmPassword,
      name,
      emailLocal,
      emailDomain,
      customDomain,
      nickname,
      memorizationMethod,
    } = formData;

    // 이메일 조합
    const email =
      emailDomain === "직접 입력하기"
        ? `${emailLocal}@${customDomain}`
        : `${emailLocal}@${emailDomain}`;

    // 입력 검증
    if (
      !userId ||
      !password ||
      !confirmPassword ||
      !name ||
      !emailLocal ||
      !nickname ||
      !memorizationMethod
    ) {
      setError("모든 필드를 입력해주세요.");
      setSuccess("");
      return;
    }

    if (emailDomain === "직접 입력하기" && !customDomain) {
      setError("이메일 도메인을 입력해주세요.");
      setSuccess("");
      return;
    }

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      setSuccess("");
      setPasswordMatchError(true);
      return;
    }

    const emailRegex = /^[^@]+@[^@]+\.[^@]+$/;
    if (!emailRegex.test(email)) {
      setError("유효한 이메일 형식을 입력해주세요.");
      setSuccess("");
      return;
    }

    try {
      const response = await axios.post(`${server}/api/public/members/join`, {
        userId,
        password,
        name,
        email,
        nickname,
        memorizationMethod,
      });

      if (response.status === 200 && response.data?.status === 200) {
        setSuccess(response.data.message);
        setError("");
        localStorage.setItem("userId", response.data.data.userId);
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else {
        setError(response.data.message || "회원가입에 실패했습니다.");
        setSuccess("");
      }
    } catch (err) {
      setError(err.response?.data?.message || "서버 오류가 발생했습니다.");
      setSuccess("");
    }
  };

  //중복확인 함수
  const handleCheckUserId = async () => {
    const { userId } = formData;

    if (!userId.trim()) {
      setUserIdMessage("아이디를 입력해주세요.");
      setIsUserIdAvailable(false);
      return;
    }

    try {
      const response = await axios.get(endpoints.validateUserId(userId));
      if (response.status === 200 && response.data.status === 200) {
        setUserIdMessage("사용 가능한 아이디입니다.");
        setIsUserIdAvailable(true);
      } else {
        setUserIdMessage(response.data.message || "아이디 확인 실패");
        setIsUserIdAvailable(false);
      }
    } catch (err) {
      if (err.response?.status === 409) {
        setUserIdMessage("이미 사용중인 아이디입니다.");
      } else {
        setUserIdMessage("아이디 확인 중 오류가 발생했습니다.");
      }
      setIsUserIdAvailable(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h1 className="signup-title">회원가입</h1>
        <form onSubmit={handleSubmit}>
          {/* 아이디 입력 */}
          <div className="signup-field">
            <label className="signup-label">아이디</label>
            <div className="signup-username-group">
              <input
                type="text"
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                placeholder="아이디를 입력하세요."
                className="signup-input"
              />
            </div>
            {userIdMessage && (
              <p
                className={`signup-message ${
                  isUserIdAvailable
                    ? "signup-message-success"
                    : "signup-message-error"
                }`}
              >
                {userIdMessage}
              </p>
            )}
          </div>

          {/* 비밀번호 입력 */}
          <div className="signup-field">
            <label className="signup-label">비밀번호</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="비밀번호를 입력하세요."
              className="signup-input"
            />
          </div>

          {/* 비밀번호 확인 */}
          <div className="signup-field">
            <label className="signup-label">비밀번호 확인</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="비밀번호를 다시 입력하세요."
              className="signup-input"
            />
            {passwordMatchError && (
              <p className="signup-message signup-message-error">
                비밀번호가 같지 않습니다.
              </p>
            )}
          </div>

          {/* 이름 입력 */}
          <div className="signup-field">
            <label className="signup-label">이름</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="이름을 입력하세요."
              className="signup-input"
            />
          </div>

          {/* 이메일 입력 */}
          <div className="signup-field">
            <label className="signup-label">이메일</label>
            <div className="signup-email-group">
              <input
                type="text"
                name="emailLocal"
                value={formData.emailLocal}
                onChange={handleChange}
                placeholder="이메일 아이디"
                className="signup-input signup-email-input"
              />
              <span className="signup-email-at">@</span>
              {formData.emailDomain === "직접 입력하기" ? (
                <input
                  type="text"
                  name="customDomain"
                  value={formData.customDomain}
                  onChange={handleChange}
                  placeholder="도메인 입력"
                  className="signup-input signup-email-input"
                />
              ) : (
                <select
                  name="emailDomain"
                  value={formData.emailDomain}
                  onChange={handleChange}
                  className="signup-email-select"
                >
                  {emailDomains.map((domain) => (
                    <option key={domain} value={domain}>
                      {domain}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* 닉네임 입력 */}
          <div className="signup-field">
            <label className="signup-label">닉네임</label>
            <input
              type="text"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              placeholder="닉네임을 입력하세요."
              className="signup-input"
            />
          </div>

          {/* 암기 방법 선택 */}
          <div className="signup-field">
            <label className="signup-label">암기 방법</label>
            <select
              name="memorizationMethod"
              value={formData.memorizationMethod}
              onChange={handleChange}
              className="signup-input"
            >
              <option value="AssociationMethod">연상법</option>
              <option value="OtherMethod">기타</option>
            </select>
          </div>

          {/* 성공/에러 메시지 */}
          {success && (
            <p className="signup-message signup-message-success">{success}</p>
          )}
          {error && (
            <p className="signup-message signup-message-error">{error}</p>
          )}

          {/* 회원가입 버튼 */}
          <button
            type="submit"
            className="w-full py-3 bg-green-500 text-white rounded-lg border-none cursor-pointer font-semibold transition-colors hover:bg-green-600"
          >
            회원가입
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
