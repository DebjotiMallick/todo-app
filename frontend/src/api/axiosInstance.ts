// src/api/axiosInstance.ts
import axios from "axios";

const BASE_URL = "http://localhost:8000";

const axiosInstance = axios.create({
  baseURL: `${BASE_URL}`, // change this
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

export default axiosInstance;
