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
// Fetch the receipt as arraybuffer with auth
export const fetchReceiptByExpenseId = async (expenseId) => {
    const token = getToken();
    const response = await api.get(`/receipts/${expenseId}`, {
      responseType: 'arraybuffer',
      headers: { Authorization: `Bearer ${token}` },
    });
  
    const contentType = response.headers['content-type'];
    // Convert arraybuffer to Blob
    const blob = new Blob([response.data], { type: contentType });
    return blob;
  };
  
  // Open the receipt in browser
 export const openReceipt = async (expenseId) => {
    try {
      const blob = await fetchReceiptByExpenseId(expenseId);
  
      // Convert blob to object URL
      const url = URL.createObjectURL(blob);
  
      setSelectedReceipt({ url, type: blob.type });
  
      // Optional: open in new tab automatically
      window.open(url);
    } catch (err) {
      console.error("Failed to fetch receipt:", err);
    }
  };
  
