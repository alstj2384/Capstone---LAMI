// EditProfile.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  getUserInfo,
  updateUserInfo,
  updatePassword,
  getUserMemorizationMethod,
  resetPasswordRequestCode,
  verifyResetPasswordCode,
} from "../api";
import SquirrelIcon from "../assets/DALAMI_2.svg";
import "./css/EditProfile.css";

const EditProfile = () => {
  const navigate = useNavigate();
  const memberId = localStorage.getItem("memberId");
  const token = localStorage.getItem("token");
  const fileInputRef = useRef(null);

  const [user, setUser] = useState({
    name: "",
    email: "",
    profilePic: SquirrelIcon,
    userId: "",
  });

  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeRequested, setIsCodeRequested] = useState(false);
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [memorizationMethod, setMemorizationMethod] =
    useState("AssociationMethod");
  const [feedbackStyle, setFeedbackStyle] = useState("POSITIVE_FEEDBACK");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getUserInfo(memberId, token);
        setUser((prev) => ({ ...prev, ...userData.data }));

        const memoRes = await getUserMemorizationMethod(memberId, token);
        setMemorizationMethod(memoRes.data || "AssociationMethod");
      } catch (error) {
        console.error("사용자 정보 불러오기 실패", error);
      }
    };
    fetchData();
  }, [memberId, token]);

  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await axios.post(
          `/api/members/${memberId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const imageUrl = response.data.profileImage; // 서버에서 반환한 이미지 URL
        setUser((prev) => ({ ...prev, profilePic: imageUrl }));
      } catch (err) {
        console.error("이미지 업로드 실패", err);
        alert("이미지 업로드에 실패했습니다.");
      }
    }
  };

  const handleSendCode = async () => {
    try {
      await resetPasswordRequestCode(user.userId);
      alert("인증번호가 이메일로 전송되었습니다.");
      setIsCodeRequested(true);
    } catch (err) {
      alert("인증번호 요청 실패");
    }
  };

  const handleVerifyCode = async () => {
    try {
      await verifyResetPasswordCode({
        userId: user.userId,
        code: verificationCode,
      });
      alert("인증번호가 확인되었습니다.");
      setIsCodeVerified(true);
    } catch (err) {
      alert("인증번호가 올바르지 않습니다.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const res = await updateUserInfo({
        id: memberId,
        data: {
          profilePic: user.profilePic,
          memorizationMethod,
          feedbackStyle,
        },
        token,
        memberId, // 🔥 반드시 포함!
      });
      console.log("🟢 응답 데이터:", res);

      if (isCodeVerified && password) {
        await updatePassword({
          userId: user.userId,
          newPassword: password,
          token,
          memberId,
        });
      }

      alert("프로필이 수정되었습니다.");
      navigate("/mypage");
    } catch (err) {
      console.error("🔴 에러 응답:", err.response?.data || err.message);
      alert("프로필 수정 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="edit-profile-page">
      <h1 className="edit-title">{user.name}님의 마이페이지</h1>

      <div className="edit-profile-pic-section">
        <img src={user.profilePic} alt="Profile" className="edit-profile-img" />
      </div>

      <form onSubmit={handleSubmit} className="edit-form">
        <label className="edit-label">프로필 사진 변경하기</label>
        <div className="edit-upload-box" onClick={handleFileClick}>
          <p>Link or drag and drop</p>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="edit-file-input"
          />
        </div>

        <div className="edit-group">
          <label className="edit-label">비밀번호 변경 (선택)</label>
          <div className="edit-verification-wrapper">
            <input
              type="text"
              placeholder="이메일로 받은 인증번호 입력"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="edit-input"
            />
            <button
              type="button"
              className="edit-code-button"
              onClick={isCodeRequested ? handleVerifyCode : handleSendCode}
            >
              {isCodeRequested ? "인증번호 확인" : "인증번호 요청"}
            </button>
          </div>

          {isCodeVerified && (
            <>
              <input
                type="password"
                placeholder="새 비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="edit-input"
              />
              <input
                type="password"
                placeholder="비밀번호 확인"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="edit-input"
              />
            </>
          )}
        </div>

        <div className="edit-group">
          <p className="edit-label">선호 암기법</p>
          {["AssociationMethod", "StorytellingMethod", "VocabularyLinking"].map(
            (method) => (
              <label key={method} className="edit-radio">
                <input
                  type="radio"
                  name="memorizationMethod"
                  value={method}
                  checked={memorizationMethod === method}
                  onChange={() => setMemorizationMethod(method)}
                />
                {method === "AssociationMethod"
                  ? "연상 암기법"
                  : method === "StorytellingMethod"
                  ? "이야기 기반 암기법"
                  : "어휘 연결 암기법"}
              </label>
            )
          )}
        </div>

        <button type="submit" className="edit-submit">
          제출하기
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
