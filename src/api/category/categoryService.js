// src/services/categoryService.jsx
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;
import { getToken } from './../auth/authService';

// 🔹 Axios instance for cleaner code
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

// 🔹 GET /categories
export const fetchAllCategories = async () => {
  try {
    const response = await api.get("/categories");
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

// 🔹 POST /categories
export const createNewCategory = async (categoryData) => {
  try {
    const response = await api.post("/categories", categoryData);
    return response.data;
  } catch (error) {
    console.error("Error creating new category:", error);
    throw error;
  }
};

// 🔹 PUT /categories/{id}
export const updateExistingCategory = async (id, categoryData) => {
  try {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

// 🔹 DELETE /categories/{id}
export const deleteExistingCategory = async (id) => {
  try {
    // Axios throws an error for non-2xx status codes, including 404 (Not Found).
    // A successful DELETE often returns a 200 or 204.
    await api.delete(`/categories/${id}`);
    return { message: "Category deleted successfully" };
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};