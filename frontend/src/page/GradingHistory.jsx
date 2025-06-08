// 📁 src/pages/GradingHistory.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getGradingList } from "../api";

const GradingHistory = () => {
  const [gradingList, setGradingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("memberId");

  useEffect(() => {
    if (!token || !userId) {
      console.warn("❗ 토큰 또는 사용자 ID가 없음");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const data = await getGradingList(token, userId);
        console.log("📥 채점 기록 응답:", data);

        const list = Array.isArray(data) ? data : data?.data || [];
        setGradingList(list);
      } catch (err) {
        console.error("❌ 채점 기록 불러오기 실패:", err);
        alert("채점 기록을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, userId]);

  const handleClick = (gradingId) => {
    navigate(`/grading-result/${gradingId}`);
  };

  if (loading) return <p>로딩 중...</p>;

  return (
    <div className="grading-history-page">
      <h2>📊 채점 기록</h2>
      {gradingList.length === 0 ? (
        <p>채점 기록이 없습니다.</p>
      ) : (
        <ul className="grading-list">
          {gradingList.map((record, idx) => (
            <li
              key={record.gradingId || idx}
              onClick={() => handleClick(record.gradingId)}
              className="grading-item"
            >
              <p>
                <strong>문제집:</strong> {record.workbookTitle}
              </p>
              <p>
                <strong>채점일:</strong>{" "}
                {record.createdAt
                  ? new Date(record.createdAt).toLocaleString()
                  : "N/A"}
              </p>
              <p>
                <strong>점수:</strong> {record.score ?? "N/A"}점
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GradingHistory;
