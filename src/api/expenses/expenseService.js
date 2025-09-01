import axios from "axios";
import { getToken } from "../auth/authService";

const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;

// Configure a single Axios instance with a base URL and default headers
const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Use an interceptor to add the authorization token to every request
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export async function fetchAllExpenses() {
  try {
    const response = await api.get("/expenses");
    return response.data;
  } catch (error) {
    console.error(
      "Error in fetchAllExpenses:",
      error.response?.data || error.message
    );
    throw error;
  }
}

export const fetchExpenseById = async (id) => {
  try {
    const response = await api.get(`/expenses/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erreur API - fetchExpenseById:", error);
    throw error;
  }
};

export const createNewExpense = async (expenseData) => {
  try {
    const response = await api.post("/expenses", expenseData);
    return response.data;
  } catch (error) {
    console.error("Erreur API - createNewExpense:", error);
    throw error;
  }
};

export const updateExistingExpense = async (id, expenseData) => {
  try {
    const response = await api.put(`/expenses/${id}`, expenseData);
    return response.data;
  } catch (error) {
    console.error("Erreur API - updateExistingExpense:", error);
    throw error;
  }
};

export const deleteExistingExpense = async (id) => {
  try {
    await api.delete(`/expenses/${id}`);
    return true;
  } catch (error) {
    console.error("Erreur API - deleteExistingExpense:", error);
    throw error;
  }
};