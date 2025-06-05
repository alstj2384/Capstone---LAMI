// src/axiosInstance.js
import axios from "./axiosInstance";

const axiosInstance = axios.create({
    // 필요하면 baseURL 추가
    // baseURL: "https://api.example.com",
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        const memberId = localStorage.getItem("memberId");

        if (token) {
            config.headers["Authorization"] = token;
        }
        if (memberId) {
            config.headers["X-User-ID"] = memberId;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // 인증 실패 시 전역 로그아웃 처리 (로컬스토리지 초기화)
            localStorage.removeItem("token");
            localStorage.removeItem("memberId");

            // 새로고침으로 AuthContext에서도 반영되도록
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
