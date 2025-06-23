// src/api/axiosInstance.ts
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
console.log(BASE_URL);

const axiosInstance = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

export default axiosInstance;
