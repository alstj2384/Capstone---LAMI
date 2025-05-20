// url.js
export const server = "http://220.67.216.23:8080";

export const endpoints = {
  signup: `${server}/api/public/members/join`,
  login: `${server}/api/auth/login`,

  validateUserId: (userId) => `${server}/api/public/members/validate/${userId}`,
};
