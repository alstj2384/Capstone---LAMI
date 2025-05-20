// url.js
export const server = "http://10.116.64.23:80";

export const endpoints = {
  signup: `${server}/api/public/members/join`,
  login: `${server}/api/auth/login`,

  validateUserId: (userId) => `${server}/api/public/members/validate/${userId}`,
};
