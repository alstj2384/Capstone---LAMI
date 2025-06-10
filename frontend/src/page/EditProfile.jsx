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
  const memberId = localStorage.getItem("memberId");
  const token = localStorage.getItem("token");
  const fileInputRef = useRef(null);

  const [user, setUser] = useState({
    name: "",
    email: "",
    profilePic: SquirrelIcon,
    userId: "",
  });
  const [nickname, setNickname] = useState(""); // 닉네임 상태 추가
  const [selectedFile, setSelectedFile] = useState(null); // Base64 문자열 또는 null
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeRequested, setIsCodeRequested] = useState(false);
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [memorizationMethod, setMemorizationMethod] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getUserInfo(memberId, token);
        setUser((prev) => ({ ...prev, ...userData.data }));
        setNickname(userData.data.name || ""); // 초기 닉네임 설정

        const memoRes = await getUserMemorizationMethod(memberId, token);
        setMemorizationMethod(
          memoRes.data.memorizationMethod || "AssociationMethod"
        );
      } catch (error) {
        console.error("사용자 정보 불러오기 실패", error);
        alert("사용자 정보를 불러오지 못했습니다.");
      }
    };
    fetchData();
  }, [memberId, token]);

  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (event) => {
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          const maxWidth = 800; // 최대 너비
          const maxHeight = 800; // 최대 높이
          let width = img.width;
          let height = img.height;

          // 비율 유지하며 크기 조정
          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          // JPEG로 변환 (품질 0.7)
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
          setSelectedFile(compressedBase64);
          setUser((prev) => ({ ...prev, profilePic: compressedBase64 }));
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendCode = async () => {
    try {
      await resetPasswordRequestCode(user.userId);
      alert("인증번호가 이메일로 전송되었습니다.");
      setIsCodeRequested(true);
    } catch (err) {
      alert("인증번호 요청에 실패했습니다.");
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

    const formData = new FormData();
    formData.append("nickname", nickname || user.name); // 닉네임 추가
    formData.append("memorizationMethod", memorizationMethod);
    if (selectedFile) {
      const byteString = atob(selectedFile.split(",")[1]);
      const mimeString = selectedFile.split(",")[0].split(":")[1].split(";")[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });
      formData.append("profileImage", blob, "profile.jpg");
    }

    try {
      const res = await updateUserInfo({
        id: memberId,
        data: formData,
        token,
        memberId,
      });
      console.log("🟢 응답 데이터:", res);

      if (res.data) {
        setUser((prev) => ({
          ...prev,
          profilePic: res.data.profileImage || prev.profilePic,
          name: res.data.nickname || prev.name,
        }));
        setNickname(res.data.nickname || nickname); // 닉네임 상태 업데이트
      }

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
      if (err.response?.data?.message) {
        alert(`프로필 수정 실패: ${err.response.data.message}`);
      } else {
        alert("프로필 수정 중 오류가 발생했습니다.");
      }
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

        <button type="submit" className="edit-submit">
          제출하기
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
