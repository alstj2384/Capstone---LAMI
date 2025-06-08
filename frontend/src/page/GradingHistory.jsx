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
      setLoading(false); // 이 줄 추가
      return;
    }

    const fetchData = async () => {
      try {
        const res = await getGradingList(token, userId);
        setGradingList(res.data || res.data?.data || []);
      } catch (err) {
        alert("채점 기록을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, userId]); // 의존성 추가

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
          {gradingList.map((record) => (
            <li
              key={record.gradingId}
              onClick={() => handleClick(record.gradingId)}
              className="grading-item"
            >
              <p>
                <strong>문제집:</strong> {record.workbookTitle}
              </p>
              <p>
                <strong>채점일:</strong>{" "}
                {new Date(record.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>점수:</strong> {record.score}점
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GradingHistory;
