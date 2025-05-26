import axios from "axios";
import { endpoints } from "./url";


//login 함수
export const loginUser = async ({ userId, password }) => {
    const response = await axios.post(endpoints.login, {
        userId,
        password,
    });
    return response.data; // { memberId }
};

// 로그아웃 
export const logoutUser = async (token) => {
    return axios.post(endpoints.logout, {}, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

//회원 탈퇴 
export const deleteUser = async (id, token) => {
    return axios.delete(endpoints.deleteUser(id), {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};
// 회원가입
export const signupUser = async (formData) => {
    const res = await axios.post(endpoints.signup, formData);
    return res.data;
};

// 회원가입 인증번호 전송
export const signupRequestRegistCode = async (email) => {
    const res = axios.post(endpoints.signupRequestRegistCode, { email });
    return res.data;
};

// 회원가입 인증번호 확인
export const signupVerifyRegistCode = async ({ email, code }) => {
    const res = await axios.post(endpoints.signupVerifyRegistCode, { email, code });
    return res.data;
};

// 비밀번호 변경 인증번호 전송 API 
export const resetPasswordRequestCode = async (userId) => {
    const res = await axios.post(endpoints.resetPasswordRequestCode, { userId });
    return res.data;
};

// 비밀번호 변경 인증번호 확인 API
export const verifyResetPasswordCode = async ({ userId, code }) => {
    const res = await axios.post(endpoints.verifyResetPasswordCode, {
        userId,
        code,
    });
    return res.data;
};

// 비밀번호 변경 API
export const updatePassword = async ({ userId, newPassword, token, memberId }) => {
    const response = await axios.post(
        endpoints.updatePassword,
        {
            userId,
            newPassword,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "X-User-ID": memberId,
                "Content-Type": "application/json",
            },
        }
    );

    return response.data;
};

// 사용자 정보 조회 
export const getUserInfo = async (id, token) => {
    const res = await axios.get(endpoints.getUserInfo(id), {
        headers: {
            Authorization: `Bearer ${token}`,
            "X-User-ID": id,
        },
    });
    return res.data;
};


//회원정보 수정 함수 
export const updateUserInfo = async ({ id, data, token }) => {
    const response = await axios.patch(
        endpoints.updateUser(id),
        data,
        {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                "X-User-ID": id,
            },
        }
    );

    return response.data;
};

// 토큰 재발급 
export const reissueToken = async (refreshToken) => {
    const res = await axios.post(
        endpoints.reissueToken,
        {},
        {
            headers: {
                Authorization: `Bearer ${refreshToken}`,
            },
        }
    );
    return res.data; // { accessToken, refreshToken }
};

// 사용자 이름 조회 
export const getUserName = async (id, token) => {
    const res = await axios.get(endpoints.getUserName(id), {
        headers: {
            Authorization: `Bearer ${token}`,
            "X-User-ID": id, // 선택사항: 서버에서 요구하면 포함
        },
    });
    return res.data; // 예: { status: 200, message: "...", data: "홍길동" }
};


//암기법 조회 
export const getUserMemorizationMethod = async (memberId, token) => {
    const res = await axios.get(endpoints.getUserMemorizationMethod(memberId), {
        headers: {
            Authorization: `Bearer ${token}`,
            "X-User-ID": memberId, // 서버 요구 시에만 포함
        },
    });
    return res.data; // 예: { data: "StorytellingMethod", ... }
};

// 문제집 생성
export const createWorkbook = async ({ formData, token }) => {
    const res = await axios.post(endpoints.createWorkbook, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
};

// 문제 단건 조회 
export const getProblem = async (problemId, token) => {
    const res = await axios.get(endpoints.getProblem(problemId), {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data.data;
};

// 아이디 중복 확인
export const validateUserId = async (memberId) => {
    const res = await axios.get(endpoints.validateUserId(memberId));
    return res.data;
};

// 문제집 수정
export const updateWorkbook = async ({ workbookId, data, token }) => {
    const res = await axios.patch(endpoints.updateWorkbook(workbookId), data, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
    return res.data;
};

// 문제집 삭제
export const deleteWorkbook = async (workbookId, token) => {
    const res = await axios.delete(endpoints.deleteWorkbook(workbookId), {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
};

// 문제집 리스트 조회
export const getWorkbookList = async (token) => {
    const res = await axios.get(endpoints.getWorkbookList, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
};

// 문제 리스트 조회
export const getProblemList = async (workbookId, token) => {
    const res = await axios.get(endpoints.getProblemList(workbookId), {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
};

// 문제 수정
export const updateProblem = async ({ workbookId, data, token }) => {
    const res = await axios.patch(endpoints.updateProblem(workbookId), data, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
    return res.data;
};

// 채점 리스트 조회
export const getGradingList = async (token) => {
    const res = await axios.get(endpoints.getGradingList, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
};

// 채점 단건 조회
export const getGrading = async (gradingId, token) => {
    const res = await axios.get(endpoints.getGrading(gradingId), {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
};

// 채점 요청
export const requestGrading = async (payload, token) => {
    const res = await axios.post(endpoints.gradingRequest, payload, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
    return res.data;
};

// 채점 ID → 문제집 ID
export const getQuizset = async (gradingId, token) => {
    const res = await axios.get(endpoints.getQuizset(gradingId), {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
};

// 복습 생성
export const createReview = async (data, token) => {
    const res = await axios.post(endpoints.createReview, data, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
    return res.data;
};

// 복습 조회
export const getReviewList = async (token) => {
    const res = await axios.get(endpoints.getReview, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
};

// 복습 문제 삭제
export const deleteReview = async (reviewId, token) => {
    const res = await axios.delete(endpoints.deleteReview(reviewId), {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
};

// 복습 주기 갱신
export const updateReviewSchedule = async ({ reviewId, difficulty, token }) => {
    const res = await axios.patch(
        endpoints.updateReviewSchedule(reviewId),
        { difficulty },
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        }
    );
    return res.data;
};

// AI 문제 생성
// 📁 api.js
export const generateAiWorkbook = async ({
    pdf,
    title,
    isPublic = "True",
    script,
    difficulty,
    multiple,
    ox,
    short,
    token,
    memberId,
}) => {
    const formData = new FormData();
    formData.append("pdf", pdf);
    formData.append("title", title);
    formData.append("isPublic", isPublic);
    formData.append("script", script);
    formData.append("difficulty", difficulty);
    formData.append("multipleChoiceAmount", multiple.toString());
    formData.append("trueFalseAmount", ox.toString());
    formData.append("shortAnswerAmount", short.toString());

    const res = await axios.post(endpoints.generateAiWorkbook, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            "X-User-ID": memberId,
            "Content-Type": "multipart/form-data",
        },
    });

    return res.data;
};


// AI 피드백
export const getAiFeedback = async ({ question, choices, answer, token }) => {
    const res = await axios.post(
        endpoints.getAiFeedback,
        { question, choices, answer },
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        }
    );
    return res.data.data.explain;
};

// AI 암기법 생성
export const generateMemorization = async ({ question, choices, answer, method, token }) => {
    const res = await axios.post(
        endpoints.generateMemorization,
        { question, choices, answer, method },
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        }
    );
    return res.data.data.memorize;
};


