// src/store/AuthContext.jsx
import { createContext, useContext, useReducer, useEffect } from "react";

const AuthContext = createContext();

const initialState = {
  isLoggedIn: false,
  token: null,
  memberId: null,
};

function authReducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      return {
        isLoggedIn: true,
        token: action.payload.token,
        memberId: action.payload.memberId,
      };
    case "LOGOUT":
      return {
        isLoggedIn: false,
        token: null,
        memberId: null,
      };
    default:
      return state;
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState, () => {
    // 초기 상태: localStorage에서 가져오기
    const token = localStorage.getItem("token");
    const memberId = localStorage.getItem("memberId");
    return token && memberId
      ? { isLoggedIn: true, token, memberId }
      : initialState;
  });

  useEffect(() => {
    if (state.isLoggedIn) {
      localStorage.setItem("token", state.token);
      localStorage.setItem("memberId", state.memberId);
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("memberId");
    }
  }, [state]);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

// 커스텀 훅
export const useAuth = () => useContext(AuthContext);
