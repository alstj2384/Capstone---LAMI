// src/store/AuthContext.jsx
import { createContext, useContext, useReducer, useEffect } from "react";

const AuthContext = createContext();

const initialState = {
  isLoggedIn: false,
  token: null,
  memberId: null,
  isInitialized: false,
};

function authReducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        isLoggedIn: true,
        token: action.payload.token,
        memberId: action.payload.memberId,
        isInitialized: true,
      };
    case "LOGOUT":
      return {
        ...state,
        isLoggedIn: false,
        token: null,
        memberId: null,
        isInitialized: true,
      };
    case "INIT":
      return {
        ...state,
        isLoggedIn: !!(action.payload.token && action.payload.memberId),
        token: action.payload.token,
        memberId: action.payload.memberId,
        isInitialized: true,
      };
    default:
      return state;
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // 앱 시작 시 1회: 초기 localStorage 기반 로그인 복원
  useEffect(() => {
    const token = localStorage.getItem("token");
    const memberId = localStorage.getItem("memberId");

    dispatch({
      type: "INIT",
      payload: { token, memberId },
    });
  }, []);

  // 로그인/로그아웃 시 localStorage 동기화
  useEffect(() => {
    if (state.isLoggedIn) {
      localStorage.setItem("token", state.token);
      localStorage.setItem("memberId", state.memberId);
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("memberId");
    }
  }, [state.isLoggedIn, state.token, state.memberId]);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

// 커스텀 훅
export const useAuth = () => useContext(AuthContext);
