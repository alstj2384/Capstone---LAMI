import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { server, endpoints } from "../url";
import axios from "../axiosInstance";
import "./css/Signup.css";
import {
  signupRequestRegistCode,
  signupUser,
  signupVerifyRegistCode,
  validateUserId,
} from "../api";

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
    emailCode: "",
  });

  const [isUserIdAvailable, setIsUserIdAvailable] = useState(null);
  const [userIdMessage, setUserIdMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [passwordMatchError, setPasswordMatchError] = useState(false);
  const [emailCodeSent, setEmailCodeSent] = useState(false);
  const [emailCodeVerified, setEmailCodeVerified] = useState(false);
  const [emailMessage, setEmailMessage] = useState("");

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

    const email =
      emailDomain === "직접 입력하기"
        ? `${emailLocal}@${customDomain}`
        : `${emailLocal}@${emailDomain}`;

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

    if (!emailCodeVerified) {
      setError("이메일 인증을 완료해주세요.");
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

  const handleSendEmailCode = async () => {
    const email =
      formData.emailDomain === "직접 입력하기"
        ? `${formData.emailLocal}@${formData.customDomain}`
        : `${formData.emailLocal}@${formData.emailDomain}`;

    try {
      const res = await signupRequestRegistCode(email);
      setEmailMessage("인증 코드가 전송되었습니다.");
      setEmailCodeSent(true);
    } catch (err) {
      setEmailMessage("이메일 전송에 실패했습니다.");
    }
  };

  const handleVerifyEmailCode = async () => {
    const email =
      formData.emailDomain === "직접 입력하기"
        ? `${formData.emailLocal}@${formData.customDomain}`
        : `${formData.emailLocal}@${formData.emailDomain}`;
    const code = formData.emailCode;

    try {
      console.log("보내는 이메일:", email, "코드:", code);

      const result = await signupVerifyRegistCode({ email, code });

      console.log("서버 응답:", result); // result는 data임

      if (result.status === 200) {
        setEmailMessage("이메일 인증이 완료되었습니다.");
        setEmailCodeVerified(true);
      } else {
        setEmailMessage(result.message || "인증 코드가 일치하지 않습니다.");
      }
    } catch (err) {
      console.error("에러:", err);
      setEmailMessage("인증 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h1 className="signup-title">회원가입</h1>
        <form onSubmit={handleSubmit}>
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
              <button
                type="button"
                className="w-40 py-1 px-1 bg-green-500 text-white rounded-md border-none cursor-pointer font-semibold transition-colors hover:bg-green-600"
                onClick={handleCheckUserId}
              >
                중복확인
              </button>
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
              <button
                type="button"
                className="w-30 py-2 px-1 bg-green-500 text-white rounded-md border-none cursor-pointer font-semibold transition-colors hover:bg-green-600"
                onClick={handleSendEmailCode}
              >
                인증코드 전송
              </button>
            </div>
            {emailCodeSent && (
              <div className="signup-field">
                <input
                  type="text"
                  name="emailCode"
                  value={formData.emailCode}
                  onChange={handleChange}
                  placeholder="인증 코드를 입력하세요."
                  className="signup-input"
                />
                <button
                  type="button"
                  className="signup-button"
                  onClick={handleVerifyEmailCode}
                >
                  인증 확인
                </button>
              </div>
            )}
            {emailMessage && (
              <p className="signup-message signup-message-info">
                {emailMessage}
              </p>
            )}
          </div>

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

          {success && (
            <p className="signup-message signup-message-success">{success}</p>
          )}
          {error && (
            <p className="signup-message signup-message-error">{error}</p>
          )}

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
