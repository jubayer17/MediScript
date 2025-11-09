export const setToken = (token) => {
  localStorage.setItem("token", token);
  // Also set as cookie for server-side API routes
  document.cookie = `authToken=${token}; path=/; max-age=604800; SameSite=Strict`;
};

export const getToken = () => localStorage.getItem("token");

export const removeToken = () => {
  localStorage.removeItem("token");
  // Also remove cookie
  document.cookie = "authToken=; path=/; max-age=0";
};
