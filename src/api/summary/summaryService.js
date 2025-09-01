import axios from "axios";
import { getToken } from "../auth/authService";

const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;

export async function getSummary(month) {
  const token = getToken();

  const year = new Date().toISOString().split('-')[0];
  const mois = new Date().toISOString().split('-')[1];


  if (!token) {
    throw new Error("No authentication token found.");
  }

  try {
    const response = await axios.get(`${BACKEND_URL}/api/summary/monthly?month=${month || `${year}-${mois}`}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    
    return response.data;
  } catch (error) {
    console.error(
      "Error in getSummary:",
      error.response?.data || error.message
    );
    throw error;
  }
}

// New function to fetch a daily summary for a given period.
export async function getDailySummary(startDate, endDate) {
  const token = getToken();

  if (!token) {
    throw new Error("No authentication token found.");
  }

  // Use the current date as a default if none is provided.
  const today = new Date().toISOString().split('T')[0];
  const start = startDate || today;
  const end = endDate || today;

  try {
    const response = await axios.get(`${BACKEND_URL}/api/summary/daily?start=${start}&end=${end}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      "Error in getDailySummary:",
      error.response?.data || error.message
    );
    throw error;
  }
}

// New function to get the sum of incomes grouped by source.
export async function getIncomesBySource() {
    const token = getToken();

    if (!token) {
        throw new Error("No authentication token found.");
    }

    try {
        const response = await axios.get(`${BACKEND_URL}/api/summary/incomeCategory`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error(
            "Error in getIncomesBySource:",
            error.response?.data || error.message
        );
        throw error;
    }
}
export async function getExpensesBySource() {
    const token = getToken();

    if (!token) {
        throw new Error("No authentication token found.");
    }

    try {
        const response = await axios.get(`${BACKEND_URL}/api/summary/expensesCategory`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error(
            "Error in getExpensesBySource:",
            error.response?.data || error.message
        );
        throw error;
    }
}
