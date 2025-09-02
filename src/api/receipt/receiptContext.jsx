// src/context/receiptContext.jsx
import { useState, createContext, useContext } from "react";
import { fetchReceiptById } from "../services/receiptService";
import { NotificationModal } from "../../components/ui/NotificationModal";

// 🔹 Context for receipts
const ReceiptContext = createContext();

export function ReceiptProvider({ children }) {
  const [receipt, setReceipt] = useState(null);

  // 🔹 Notification state
  const [notification, setNotification] = useState({
    isOpen: false,
    type: "success",
    message: "",
  });

  // 🔹 Helper to show notifications
  const showNotification = (type, message) => {
    setNotification({ isOpen: true, type, message });
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, isOpen: false }));
    }, 2500); // auto close after 2.5s
  };

  // 🔹 Action to fetch receipt by expense ID
  const handleFetchReceipt = async (id) => {
    try {
      const data = await fetchReceiptById(id);
      setReceipt(data);
      return data;
    } catch (error) {
      console.error("Error fetching receipt:", error);
      showNotification("error", "Failed to fetch receipt");
      throw error;
    }
  };

  return (
    <ReceiptContext.Provider
      value={{
        receipt,
        handleFetchReceipt,
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

// 🔹 Hook to use receipt context
export function useReceipts() {
  const context = useContext(ReceiptContext);
  if (!context) {
    throw new Error("useReceipts must be used within a ReceiptProvider");
  }
  return context;
}

// 🔹 Hook to access only actions
export function useReceiptActions() {
  const { handleFetchReceipt, showNotification } = useReceipts();
  return { handleFetchReceipt, showNotification };
}
