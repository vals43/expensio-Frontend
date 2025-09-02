// src/services/receiptService.jsx
import axios from "axios";
import { getToken } from "../auth/authService";

const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;

// 🔹 Axios instance
const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔹 Add auth token to every request
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔹 GET /receipts/{id}
export const fetchReceiptById = async (id) => {
  try {
    const response = await api.get(`/receipts/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching receipt with id ${id}:`, error);
    throw error;
  }
};
