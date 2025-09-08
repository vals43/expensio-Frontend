// src/services/incomeService.js
import apiClient from '../auth/apiClient';

export async function fetchAllIncomes() {
  try {
    const response = await apiClient.get("api/incomes");
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
    const response = await apiClient.get(`api/incomes/${id}`);
    return response.data;
  } catch (error) {
    console.error("API Error - fetchIncomeById:", error);
    throw error;
  }
};

export const createNewIncome = async (incomeData) => {
  try {
    const response = await apiClient.post("api/incomes", incomeData);
    return response.data;
  } catch (error) {
    console.error("API Error - createNewIncome:", error);
    throw error;
  }
};

export const updateExistingIncome = async (id, incomeData) => {
  try {
    const response = await apiClient.put(`api/incomes/${id}`, incomeData);
    return response.data;
  } catch (error) {
    console.error("API Error - updateExistingIncome:", error);
    throw error;
  }
};

export const deleteExistingIncome = async (id) => {
  try {
    await apiClient.delete(`api/incomes/${id}`);
    return true;
  } catch (error) {
    console.error("API Error - deleteExistingIncome:", error);
    throw error;
  }
};