import { useState, createContext, useContext } from "react";
import { fetchReceiptByExpenseId } from "./receiptService";
import { NotificationModal } from "../../components/ui/NotificationModal";

// Context for receipts
const ReceiptContext = createContext();

export function ReceiptProvider({ children }) {
  const [receipt, setReceipt] = useState(null);

  // Notification state
  const [notification, setNotification] = useState({
    isOpen: false,
    type: "success",
    message: "",
  });

  // Show notifications
  const showNotification = (type, message) => {
    setNotification({ isOpen: true, type, message });
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, isOpen: false }));
    }, 2500);
  };

  // === New: fetch receipt blob without opening ===
  const handleFetchReceipt = async (expenseId) => {
    try {
      const response = await fetchReceiptByExpenseId(expenseId);
      // The service already returns { data, type }
      const blob = new Blob([response.data], { type: response.type || "application/pdf" });
      return blob; // just return the blob
    } catch (err) {
      console.error("Failed to fetch receipt:", err);
      showNotification("error", "Failed to fetch receipt");
      throw err;
    }
  };

  // Fetch and open receipt automatically
  const openReceipt = async (expenseId) => {
    try {
      const blob = await handleFetchReceipt(expenseId);

      const url = URL.createObjectURL(blob);
      setReceipt({ url, type: blob.type });

      // Optional: open in new tab
      window.open(url);
    } catch (err) {
      console.error("Failed to open receipt:", err);
    }
  };

  // Clear currently selected receipt
  const clearReceipt = () => {
    if (receipt?.url) {
      URL.revokeObjectURL(receipt.url); // free memory
      setReceipt(null);
    }
  };

  return (
    <ReceiptContext.Provider
      value={{
        receipt,
        openReceipt,
        handleFetchReceipt,
        clearReceipt,
        showNotification,
      }}
    >
      {children}
      <NotificationModal
        isOpen={notification.isOpen}
        onClose={() => setNotification((prev) => ({ ...prev, isOpen: false }))}
        type={notification.type}
        message={notification.message}
      />
    </ReceiptContext.Provider>
  );
}

// Hook to use the receipt context
export function useReceipts() {
  const context = useContext(ReceiptContext);
  if (!context) {
    throw new Error("useReceipts must be used within a ReceiptProvider");
  }
  return context;
}

// Hook to access only actions
export function useReceiptActions() {
  const { openReceipt, handleFetchReceipt, clearReceipt, showNotification } = useReceipts();
  return { openReceipt, handleFetchReceipt, clearReceipt, showNotification };
}
