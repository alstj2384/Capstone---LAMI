import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/Signup.css";

const Signup = () => {
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .post("https://10.116.74.23:3192/api/public/members/join")
      .then((res) => {
        console.log(res.data); // 서버에서 받은 데이터
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  // 상태 관리
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    emailLocal: "", // 이메일 로컬 부분 (예: user)
    emailDomain: "hanmail.com", // 이메일 도메인 (예: hanmail.com)
    customDomain: "", // 직접 입력한 도메인
  });
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(null);
  const [usernameMessage, setUsernameMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [passwordMatchError, setPasswordMatchError] = useState(false);

  // 이메일 도메인 옵션
  const emailDomains = [
    "hanmail.com",
    "google.com",
    "naver.com",
    "직접 입력하기",
  ];

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "username") {
      setIsUsernameAvailable(null); // 아이디 변경 시 중복 확인 상태 초기화
      setUsernameMessage("");
    }

    // 비밀번호 확인 메시지 업데이트
    if (name === "password" || name === "confirmPassword") {
      setPasswordMatchError(
        formData.password !== value &&
          name === "confirmPassword" &&
          value !== ""
      );
      if (name === "password") {
        setPasswordMatchError(
          value !== formData.confirmPassword && formData.confirmPassword !== ""
        );
      }
    }
  };

  // 아이디 중복확인 핸들러
  const handleCheckUsername = async () => {
    const { username } = formData;
    if (!username) {
      setUsernameMessage("아이디를 입력해주세요.");
      setIsUsernameAvailable(false);
      return;
    }

    try {
      const response = await axios.post(
        "https://your-api-endpoint/check-username",
        { username }
      );
      if (response.data.status === 200) {
        setUsernameMessage("사용 가능한 아이디입니다.");
        setIsUsernameAvailable(true);
      } else {
        setUsernameMessage(
          response.data.message || "이미 사용 중인 아이디입니다."
        );
        setIsUsernameAvailable(false);
      }
    } catch (err) {
      setUsernameMessage(
        err.response?.data?.message || "중복 확인 중 오류가 발생했습니다."
      );
      setIsUsernameAvailable(false);
    }
  };

  // 회원가입 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      username,
      password,
      confirmPassword,
      emailLocal,
      emailDomain,
      customDomain,
    } = formData;

    // 이메일 조합
    const email =
      emailDomain === "직접 입력하기"
        ? `${emailLocal}@${customDomain}`
        : `${emailLocal}@${emailDomain}`;

    // 입력 검증
    if (
      !username ||
      !password ||
      !confirmPassword ||
      !emailLocal ||
      (emailDomain === "직접 입력하기" && !customDomain)
    ) {
      setError("모든 필드를 입력해주세요.");
      setSuccess("");
      return;
    }
    if (isUsernameAvailable === null) {
      setError("아이디 중복확인을 해주세요.");
      setSuccess("");
      return;
    }
    if (!isUsernameAvailable) {
      setError("사용 가능한 아이디로 변경해주세요.");
      setSuccess("");
      return;
    }
    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      setSuccess("");
      setPasswordMatchError(true);
      return;
    }

    // 이메일 형식 검증
    const emailRegex = /^[^@]+@[^@]+\.[^@]+$/;
    if (!emailRegex.test(email)) {
      setError("유효한 이메일 형식을 입력해주세요.");
      setSuccess("");
      return;
    }

    try {
      const response = await axios.post("https://your-api-endpoint/signup", {
        username,
        password,
        email,
      });
      if (response.data.status === 200) {
        setSuccess(response.data.message); // "잘됐습니다~~~~"
        setError("");
        // userid 저장 (예: localStorage)
        localStorage.setItem("userid", response.data.data.userid);
        console.log("회원가입 데이터:", {
          username,
          email,
          userid: response.data.data.userid,
        });
        // 성공 메시지 표시 후 로그인 페이지로 이동
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

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h1 className="signup-title">회원가입</h1>
        <form onSubmit={handleSubmit}>
          {/* 아이디 입력 및 중복확인 */}
          <div className="signup-field">
            <label className="signup-label">아이디</label>
            <div className="signup-username-group">
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="아이디를 입력하세요."
                className="signup-input"
              />
              <button
                type="button"
                onClick={handleCheckUsername}
                className="px-3 py-2 bg-blue-500 text-white rounded-md border-none cursor-pointer text-xs font-semibold transition-colors whitespace-nowrap hover:bg-blue-600 opacity-100"
              >
                중복확인
              </button>
            </div>
            {usernameMessage && (
              <p
                className={`signup-message ${
                  isUsernameAvailable
                    ? "signup-message-success"
                    : "signup-message-error"
                }`}
              >
                {usernameMessage}
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
