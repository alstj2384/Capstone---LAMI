// 📁 src/page/GradingResult.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getGrading } from "../api";

import "./css/Result.css"; // Result 스타일 재사용

const GradingResult = () => {
  const { id } = useParams(); // gradingId
  const navigate = useNavigate();

  const [grading, setGrading] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const token = localStorage.getItem("token");
  const memberId = localStorage.getItem("memberId"); // 추가

  useEffect(() => {
    const fetchGrading = async () => {
      try {
        console.log("📦 gradingId:", id);
        const res = await getGrading(id, token, memberId); // ✅ memberId 넘기기
        setGrading(res.data || res);
      } catch (error) {
        console.error("❌ 채점 결과 오류:", error);
        alert("채점 결과를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (id && token && memberId) {
      fetchGrading();
    } else {
      setLoading(false);
    }
  }, [id, token, memberId]);

  if (loading) return <p>로딩 중...</p>;

  if (!grading) return <p>채점 결과가 없습니다.</p>;

  return (
    <div className="result-container">
      <h2>📋 채점 결과</h2>
      <p>
        <strong>문제집:</strong> {grading.workbookTitle}
      </p>
      <p>
        <strong>채점일:</strong> {new Date(grading.createdAt).toLocaleString()}
      </p>
      <p>
        <strong>점수:</strong> {grading.score}점
      </p>
      <p>
        <strong>총 문항 수:</strong> {grading.totalProblems}문제
      </p>
      <p>
        <strong>맞은 개수:</strong> {grading.correctCount}개
      </p>

      <button onClick={() => navigate(-1)} className="result-button">
        🔙 이전으로
      </button>
    </div>
  );
};

export default GradingResult;
