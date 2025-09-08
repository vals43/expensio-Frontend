import apiClient from "../auth/apiClient";

// 🔹 GET /receipts/{id}
// Fetch the receipt as arraybuffer with auth
export const fetchReceiptByExpenseId = async (expenseId) => {
  try {
    const response = await apiClient.get(`/receipts/${expenseId}`, {
      responseType: "arraybuffer", // Fetch as binary data
    });
    const contentType = response.headers["content-type"];
    const blob = new Blob([response.data], { type: contentType });
    return blob;
  } catch (error) {
    console.error("Error fetching receipt:", error.message, error.response?.data);
    throw error; // Propagate the error for handling upstream
  }
};

// 🔹 Open the receipt (to be used in a component)
// Note: setSelectedReceipt should be passed from the calling component
export const openReceipt = async (expenseId, setSelectedReceipt) => {
  try {
    const blob = await fetchReceiptByExpenseId(expenseId);

    const url = URL.createObjectURL(blob);

    // Update state with the receipt data (handled by the component)
    if (setSelectedReceipt) {
      setSelectedReceipt({ url, type: blob.type });
    }

    // Optional: open in new tab automatically
    window.open(url);
    return url; // Return URL for further use if needed
  } catch (err) {
    console.error("Failed to fetch receipt:", err.message, err.response?.data);
    throw err; // Propagate error for component handling
  }
};
