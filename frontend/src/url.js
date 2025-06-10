
// url.js
export const server = "http://10.116.64.23:80";

export const endpoints = {
  signup: `${server}/api/public/members/join`, //회원가입 
  login: `${server}/api/public/members/login`, // 로그인 
  logout: `${server}/api/public/members/logout`, // 로그아웃
  validateUserId: (memberId) => `${server}/api/public/members/validate/${memberId}`, //로그인 중복확인 
  getUserInfo: (memberId) => `${server}/api/members/${memberId}`, // 회원정보 조회 
  updateUser: (memberId) => `${server}/api/members/${memberId}`, // 회원정보 수정 
  uploadImage: (memberId) => `${server}/api/members/${memberId}`, // 회원정보 수정 파일추가 
  deleteUser: (memberId) => `${server}/api/members/${memberId}`, // 회원 탈퇴
  resetPasswordRequestCode: `${server}/api/public/members/reset-password/request-code`, // 비밀번호 변경 인증번호 요청
  verifyResetPasswordCode: `${server}/api/public/members/reset-password/verify-code`, // 비밀번호 변경 인증번호 확인
  updatePassword: `${server}/api/members/reset-password`, // 비밀번호 변경 
  signupRequestRegistCode: `${server}/api/public/members/request-regist-code`, // 회원가입 인증번호 전송
  signupVerifyRegistCode: `${server}/api/public/members/verify-regist-code`, // 회원가입시 인증번호 검증
  reissueToken: `${server}/api/public/members/reissue-token`,
  getUserName: (id) => `${server}/api/members/name/${id}`,
  getUserMemorizationMethod: (id) => `${server}/api/members/memorization/${id}`, // 암기법 조회 
  createWorkbook: `${server}/api/workbook`, // 문제집 생성
  updateWorkbook: (workbookId) => `${server}/api/workbook/${workbookId}`, // 문제집 수정 
  deleteWorkbook: (workbookId) => `${server}/api/workbook/${workbookId}`, // 문제집 삭제 
  getWorkbook: (workbookId) => `${server}/api/workbook/${workbookId}`, // 문제집 조회 
  getWorkbookList: `${server}/api/workbook/list`, // 문제집 리스트 조회 
  getProblem: (problemId) => `${server}/api/problem/${problemId}`, // 문제 단건 조회 
  getProblemList: (workbookId) => `${server}/api/problem/list/${workbookId}`, // 문제 리스트 조회 
  updateProblem: (workbookId) => `${server}/api/problem/${workbookId}`, // 문제 수정 
  getGradingList: `${server}/api/grading`, // 채점 리스트 조회
  getGrading: (gradingId) => `${server}/api/grading/${gradingId}`, // 채점 단건 조회 
  gradingRequest: `${server}/api/grading`, // 채점 요청 
  getQuizset: (gradingId) => `${server}/api/grading/quizset/${gradingId}`, // 채점 ID -> 문제집 ID 
  createReview: `${server}/api/review`, // 복습 생성 
  getReview: `${server}/api/review`, // 복습 조회
  deleteReview: (reviewId) => `${server}/api/review/${reviewId}`, // 복습 문제 삭제
  updateReviewSchedule: (reviewId) => `${server}/api/review/${reviewId}`,
  generateAiWorkbook: `${server}/api/workbook`,
  getAiFeedback: `${server}/api/feedback`,
  generateMemorization: `${server}/api/memorization`,
};
