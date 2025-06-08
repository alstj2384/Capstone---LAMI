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

  useEffect(() => {
    const fetchGrading = async () => {
      try {
        const res = await getGrading(id, token);
        setGrading(res.data || res); // 안정적으로 처리
      } catch (error) {
        alert("채점 결과를 불러오는 데 실패했습니다.");
        console.error("채점 결과 오류:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGrading();
  }, [id, token]);

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
