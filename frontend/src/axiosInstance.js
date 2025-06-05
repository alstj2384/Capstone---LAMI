// src/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://10.116.64.23:80", // 오타 수정 (http: 중복 제거)
    timeout: 10000,
});

axiosInstance.interceptors.request.use(
    (config) => {
        const isPublicApi = config.url?.includes("/public/");

        // 인증 필요 없는 요청은 헤더 제외
        if (!isPublicApi) {
            const token = localStorage.getItem("token");
            const memberId = localStorage.getItem("memberId");

            if (token) config.headers["Authorization"] = token;
            if (memberId) config.headers["X-User-ID"] = memberId;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("memberId");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
