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

export async function fetchAllIncomes() {
  try {
    const response = await api.get("/incomes");
    return response.data;
  } catch (error) {
    console.error(
      "Error in fetchAllIncomes:",
      error.response?.data || error.message
    );
    throw error;
  }
}

export const fetchIncomeById = async (id) => {
  try {
    const response = await api.get(`/incomes/${id}`);
    return response.data;
  } catch (error) {
    console.error("API Error - fetchIncomeById:", error);
    throw error;
  }
};

export const createNewIncome = async (incomeData) => {
  try {
    const response = await api.post("/incomes", incomeData);
    return response.data;
  } catch (error) {
    console.error("API Error - createNewIncome:", error);
    throw error;
  }
};

export const updateExistingIncome = async (id, incomeData) => {
  try {
    const response = await api.put(`/incomes/${id}`, incomeData);
    return response.data;
  } catch (error) {
    console.error("API Error - updateExistingIncome:", error);
    throw error;
  }
};

export const deleteExistingIncome = async (id) => {
  try {
    await api.delete(`/incomes/${id}`);
    return true;
  } catch (error) {
    console.error("API Error - deleteExistingIncome:", error);
    throw error;
  }
};