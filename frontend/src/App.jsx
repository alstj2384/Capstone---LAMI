import React, { useState, useEffect } from "react";
import axios from "./axiosInstance";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { endpoints } from "./url";
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
import { useAuth } from "./store/AuthContext.jsx";
import "./App.css";

// ProtectedRoute component to restrict access
const ProtectedRoute = ({ children }) => {
  const { state } = useAuth();

  if (!state.isInitialized) {
    return null;
  }

  if (!state.isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const App = () => {
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
        <Route path="/solve/:quizSetId" element={<Solve />} />{" "}
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
      </Routes>
    </Router>
  );
};

export default App;
