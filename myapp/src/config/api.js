import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api", // import.meta.env.VITE_API_URL || 
});

// Auto-attach token
API.interceptors.request.use((config) => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  if (userInfo?.token) {
    config.headers.Authorization = `Bearer ${userInfo.token}`;
  }
  return config;
});

export default API;
