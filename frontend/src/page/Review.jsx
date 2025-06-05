import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SquirrelIcon from "../assets/DALAMI_2.svg";
import { getReviewList } from "../api";
import "./css/Review.css";

const Review = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const memberId = localStorage.getItem("memberId");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await getReviewList(token, memberId);
        if (res?.data?.results) {
          setReviews(res.data.results);
        } else {
          throw new Error("Invalid response");
        }
      } catch (error) {
        console.error("리뷰 불러오기 실패. 임시 데이터 사용:", error);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [token, memberId]);

  const handleSolve = (quizSetId, reviewId) => {
    navigate(`/solve/${quizSetId}?reviewId=${reviewId}`);
  };

  return (
    <div className="review-page">
      <div className="review-container">
        <h1 className="review-title">오늘의 복습</h1>

        {loading ? (
          <p className="review-loading">복습 문제를 불러오는 중입니다...</p>
        ) : reviews.length > 0 ? (
          <div className="review-problem-sets">
            {reviews.map((review) => (
              <div key={review.reviewId} className="review-problem-set">
                <img
                  src={SquirrelIcon}
                  alt="Icon"
                  className="review-problem-set-icon"
                />
                <h3 className="review-problem-set-title">
                  {review.quizContent}
                </h3>

                <p className="review-answer">
                  정답: {review.choices
                    ? review.choices.split(",")[parseInt(review.answer, 10) - 1] || "선택지 없음"
                    : review.answer}
                </p>

                <button
                  className="review-problem-set-button"
                  onClick={() => handleSolve(review.quizSetId, review.reviewId)}
                >
                  해당 문제집 다시 풀기
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="review-empty">복습 문제가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default Review;
