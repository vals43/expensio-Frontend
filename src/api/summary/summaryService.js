import apiClient from "../auth/apiClient";

export async function getSummary(month) {
  const year = new Date().toISOString().split('-')[0];
  const mois = new Date().toISOString().split('-')[1];

  try {
    const response = await apiClient.get(`api/summary/monthly?month=${month || `${year}-${mois}`}`);

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
  // Use the current date as a default if none is provided.
  const today = new Date().toISOString().split('T')[0];
  const start = startDate || today;
  const end = endDate || today;

  try {
    const response = await apiClient.get(`api/summary/daily?start=${start}&end=${end}`);

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
  try {
    const response = await apiClient.get(`api/summary/incomeCategory`);

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
  try {
    const response = await apiClient.get(`api/summary/expensesCategory`);

    return response.data;
  } catch (error) {
    console.error(
      "Error in getExpensesBySource:",
      error.response?.data || error.message
    );
    throw error;
  }
}
