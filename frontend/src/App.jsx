import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "./redux/authSlice";

import TopNav from "./component/TopNav.jsx";
import Home from "./page/Home.jsx";
import Create from "./page/Create.jsx";
import Explore from "./page/Explore.jsx";
import Share from "./page/Share.jsx";
import ShareComplete from "./page/ShareComplete.jsx";
import Solve from "./page/Solve.jsx";
import Result from "./page/Result.jsx";
import Review from "./page/Review.jsx";
import Login from "./page/Login.jsx";
import Signup from "./page/Signup.jsx";
import MyPage from "./page/MyPage.jsx";
import EditMyPage from "./page/EditProfile.jsx";
import "./App.css";
import EditWorkBook from "./page/EditWorkBook.jsx";
import GradingHistory from "./page/GradingHistory.jsx";
import GradingResult from "./page/GradingResult.jsx";

//  인증이 필요한 라우트
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, isInitialized } = useSelector((state) => state.auth);

  if (!isInitialized) return null;
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return children;
};

const App = () => {
  const dispatch = useDispatch();

  //  앱 시작 시 토큰 검증 요청
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <Router>
      <TopNav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <Create />
            </ProtectedRoute>
          }
        />
        <Route path="/share" element={<Share />} />
        <Route path="/share-complete" element={<ShareComplete />} />
        <Route path="/solve/:quizSetId" element={<Solve />} />
        <Route path="/result" element={<Result />} />
        <Route
          path="/review"
          element={
            <ProtectedRoute>
              <Review />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mypage"
          element={
            <ProtectedRoute>
              <MyPage />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/edit-mypage" element={<EditMyPage />} />
        <Route path="/grading-history" element={<GradingHistory />} />
        <Route path="/grading-result/:id" element={<GradingResult />} />
        <Route
          path="/editworkbook/:workbookId"
          element={
            <ProtectedRoute>
              <EditWorkBook />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
