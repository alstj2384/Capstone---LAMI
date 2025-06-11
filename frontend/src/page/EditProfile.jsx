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
import axios from "../axiosInstance";

const EditProfile = () => {
  const navigate = useNavigate();
  const memberId = localStorage.getItem("memberId"); // "13"
  const token = localStorage.getItem("token");
  const storedUserId = localStorage.getItem("userId") || "kmj9444"; // "kmj9444" 우선
  const fileInputRef = useRef(null);

  const [user, setUser] = useState({
    name: "",
    email: "",
    profilePic: SquirrelIcon,
    memberId: memberId || "",
    userId: storedUserId, // 초기값으로 storedUserId 설정
  });
  const [nickname, setNickname] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeRequested, setIsCodeRequested] = useState(false);
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [memorizationMethod, setMemorizationMethod] = useState("");
  const [isUploading, setIsUploading] = useState(false); // 초기값 확실히 false
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getUserInfo(memberId, token);
        console.log("사용자 정보 응답:", userData.data);
        setUser((prev) => ({
          ...prev,
          ...userData.data,
          memberId: userData.data.memberId || memberId || prev.memberId,
          userId: storedUserId, // userId는 storedUserId로 고정
        }));
        setNickname(userData.data.nickname || userData.data.name || "");
        const memoRes = await getUserMemorizationMethod(memberId, token);
        setMemorizationMethod(
          memoRes.data.memorizationMethod || "AssociationMethod"
        );
      } catch (error) {
        console.error("사용자 정보 불러오기 실패:", error);
        alert("사용자 정보를 불러오지 못했습니다.");
      }
    };
    fetchData();
  }, [memberId, token, storedUserId]);

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file); // 파일 객체 저장
      setUser((prev) => ({
        ...prev,
        profilePic: URL.createObjectURL(file),
      }));
    }
  };

  const handleSendCode = async () => {
    if (!user.email) {
      alert("이메일 정보가 없습니다. 사용자 정보를 확인하세요.");
      return;
    }

    if (!user.userId) {
      alert("사용자 ID 정보가 없습니다. 사용자 정보를 확인하세요.");
      return;
    }

    setIsSendingCode(true);
    try {
      await resetPasswordRequestCode(user.userId);
      alert(`인증번호가 ${user.email}로 전송되었습니다.`);
      setIsCodeRequested(true);
      setCooldown(60);
    } catch (err) {
      console.error("인증번호 요청 실패:", err.response?.data || err.message);
      alert(
        err.response?.data?.message ||
          "인증번호 요청에 실패했습니다. 다시 시도해주세요."
      );
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!/^\d{6}$/.test(verificationCode)) {
      alert("인증번호는 숫자 6자리여야 합니다.");
      return;
    }

    setIsSendingCode(true);
    try {
      const response = await verifyResetPasswordCode({
        userId: user.userId,
        code: verificationCode,
      });
      console.log("인증 확인 응답:", response);
      if (response && response.status === 200) {
        // 서버 응답 구조 확인
        alert("인증번호가 확인되었습니다.");
        setIsCodeVerified(true);
      } else {
        alert(response.message || "인증번호 확인 실패");
      }
    } catch (err) {
      console.error("인증번호 확인 실패:", err.response?.data || err.message);
      alert(
        err.response?.data?.message ||
          "인증번호가 올바르지 않습니다. 다시 확인해주세요."
      );
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    setIsUploading(true);
    let profileImageUrl = user.profilePic;
    const data = {
      nickname: nickname || user.name,
      memorizationMethod,
      profileImageUrl,
    };

    try {
      const res = await updateUserInfo({
        id: memberId,
        data,
        token,
        memberId,
      });
      console.log("🟢 응답 데이터:", res.data);

      if (res.data) {
        setUser((prev) => ({
          ...prev,
          profilePic: res.data.profileImageUrl || prev.profilePic,
          name: res.data.nickname || res.data.name || prev.name,
        }));
        setNickname(res.data.nickname || res.data.name || nickname);
      }

      if (isCodeVerified && password) {
        await updatePassword({
          userId: user.userId,
          newPassword: password,
          token,
          memberId: user.memberId,
        });
      }

      alert("프로필이 수정되었습니다.");
      navigate("/mypage");
    } catch (err) {
      console.error("🔴 에러 응답:", err.response?.data || err.message);
      if (err.response?.status === 415) {
        alert("서버가 요청 형식을 지원하지 않습니다. 관리자에게 문의하세요.");
      } else if (err.response?.data?.message) {
        alert(`프로필 수정 실패: ${err.response.data.message}`);
      } else {
        alert("프로필 수정 중 오류가 발생했습니다.");
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="edit-profile-page">
      <h1 className="edit-title">{user.name}님의 마이페이지</h1>
      <div className="edit-profile-pic-section">
        <img src={user.profilePic} alt="Profile" className="edit-profile-img" />
      </div>
      <form onSubmit={handleSubmit} className="edit-form">
        <div className="edit-group">
          <label className="edit-label">닉네임</label>
          <input
            type="text"
            placeholder="닉네임을 입력하세요"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="edit-input"
          />
        </div>
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
          <p className="edit-info">
            인증번호는 {user.email || "이메일 정보 없음"}으로 전송됩니다.
          </p>
          <div className="edit-verification-wrapper">
            <input
              type="text"
              placeholder="인증번호 6자리 입력"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="edit-input"
            />
            <button
              type="button"
              className="edit-code-button"
              onClick={isCodeRequested ? handleVerifyCode : handleSendCode}
            >
              {(() => {
                if (isSendingCode) return "처리 중...";
                if (isCodeRequested) return "인증번호 확인";
                if (cooldown > 0) return `재전송 (${cooldown}s)`;
                return "인증번호 요청"; // 기본값 반드시 있어야 함
              })()}
            </button>
          </div>
          {isCodeRequested && !isCodeVerified && (
            <p className="edit-info">인증번호는 5분간 유효합니다.</p>
          )}
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
          {[
            "AssociationMethod",
            "StorytellingMethod",
            "VocabConnectMethod",
          ].map((method) => (
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
          ))}
        </div>
        <button type="submit" className="edit-submit" disabled={isUploading}>
          {isUploading ? (
            <>
              <span className="spinner" /> 업로드 중...
            </>
          ) : (
            "제출하기"
          )}
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
