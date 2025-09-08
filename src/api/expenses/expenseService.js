// src/services/expenseService.js
import apiClient from '../auth/apiClient';

export async function fetchAllExpenses() {
  try {
    const response = await apiClient.get("api/expenses");
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
    const response = await apiClient.get(`api/expenses/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erreur API - fetchExpenseById:", error);
    throw error;
  }
};

export const createNewExpense = async (expenseData) => {
  try {
    const response = await apiClient.post("api/expenses", expenseData);
    return response.data;
  } catch (error) {
    console.error("Erreur API - createNewExpense:", error);
    throw error;
  }
};

export const updateExistingExpense = async (id, expenseData) => {
  try {
    const response = await apiClient.put(`api/expenses/${id}`, expenseData);
    return response.data;
  } catch (error) {
    console.error("Erreur API - updateExistingExpense:", error);
    throw error;
  }
};

export const deleteExistingExpense = async (id) => {
  try {
    await apiClient.delete(`api/expenses/${id}`);
    return true;
  } catch (error) {
    console.error("Erreur API - deleteExistingExpense:", error);
    throw error;
  }
};