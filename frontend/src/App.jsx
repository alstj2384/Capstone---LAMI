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
import "./App.css";

// ProtectedRoute component to restrict access
const ProtectedRoute = ({ isLoggedIn, children }) => {
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get(endpoints.user)
        .then((response) => {
          const { name, profilePic } = response.data;
          setUser({ name, profilePic, token });
          setIsLoggedIn(true);
        })
        .catch((error) => {
          console.error("Failed to restore user:", error);
          localStorage.removeItem("token");
          setIsLoggedIn(false);
          setUser(null);
        });
    }
  }, []);

  const handleLogin = (userData) => {
    const { name, profilePic, token } = userData;
    localStorage.setItem("token", token);
    setUser({ name, profilePic, token });
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.setItem("timeSpent", "0");
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <Router>
      <TopNav isLoggedIn={isLoggedIn} user={user} handleLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route
          path="/create"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Create />
            </ProtectedRoute>
          }
        />
        <Route path="/share" element={<Share />} />
        <Route path="/share-complete" element={<ShareComplete />} />
        <Route path="/solve" element={<Solve />} />
        <Route path="/result" element={<Result />} />
        <Route
          path="/review"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Review />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mypage"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <MyPage isLoggedIn={isLoggedIn} />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
};

export default App;
