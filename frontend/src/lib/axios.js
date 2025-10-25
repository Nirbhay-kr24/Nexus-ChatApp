import axios from "axios";

const VITE_BACKEND = import.meta.env.VITE_BACKEND_URL;
const isDev = import.meta.env.MODE === "development";

const baseURL = isDev
  ? "http://localhost:5001/api"
  : VITE_BACKEND
  ? `${VITE_BACKEND.replace(/\/$/, "")}/api`
  : "/api";

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});
