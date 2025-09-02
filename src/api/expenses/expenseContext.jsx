// src/context/expenseContext.jsx
import { useEffect, useState, createContext, useContext } from "react";
import {
  fetchAllExpenses,
  createNewExpense,
  updateExistingExpense,
  deleteExistingExpense,
} from "./expenseService";
import { NotificationModal } from "../../components/ui/NotificationModal";

export function getJsonExpenses() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const data2 = await fetchAllExpenses();
        setData(data2);
      } catch (error) {
        console.error("Erreur lors du fetch des dépenses :", error);
      }
    };
    fetchAllData();
  }, []);

  return data;
}

// 🔹 Context pour les expenses
const ExpenseContext = createContext();

export function ExpenseProvider({ children }) {
  const [expenses, setExpenses] = useState([]);

  // 🔹 Notification modal state
  const [notification, setNotification] = useState({
    isOpen: false,
    type: "success",
    message: "",
  });

  // 🔹 Fetch initial des dépenses
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const data = await fetchAllExpenses();
        setExpenses(data || []);
      } catch (error) {
        console.error("Erreur lors du fetch des dépenses :", error);
        showNotification("error", "Failed to fetch expenses");
      }
    };
    fetchExpenses();
  }, []);

  // 🔹 Helper pour ouvrir la notification
  const showNotification = (type, message) => {
    setNotification({ isOpen: true, type, message });
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, isOpen: false }));
    }, 2500); // auto close après 2.5s
  };

  // 🔹 Actions sur les dépenses
  const handleCreateExpense = async (newExpenseData) => {
    try {
      const response = await createNewExpense(newExpenseData);
      setExpenses((prev) => [...prev, response]);
      showNotification("success", "Expense added successfully");
      return response;
    } catch (error) {
      console.error("Erreur lors de la création de la dépense:", error);
      showNotification("error", "Failed to add expense");
      throw error;
    }
  };

  const handleUpdateExpense = async (id, updatedData) => {
    try {
      const response = await updateExistingExpense(id, updatedData);
      setExpenses((prev) =>
        prev.map((expense) => (expense.id === id ? response : expense))
      );
      showNotification("success", "Expense updated successfully");
      return response;
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la dépense:", error);
      showNotification("error", "Failed to update expense");
      throw error;
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      await deleteExistingExpense(id);
      setExpenses((prev) => prev.filter((expense) => expense.id !== id));
      showNotification("success", "Expense deleted successfully");
    } catch (error) {
      console.error("Erreur lors de la suppression de la dépense:", error);
      showNotification("error", "Failed to delete expense");
      throw error;
    }
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        handleCreateExpense,
        handleUpdateExpense,
        handleDeleteExpense,
        showNotification, // pour usage manuel si besoin
      }}
    >
      {children}

      {/* Notification Modal */}
      <NotificationModal
        isOpen={notification.isOpen}
        onClose={() => setNotification((prev) => ({ ...prev, isOpen: false }))}
        type={notification.type}
        message={notification.message}
      />
    </ExpenseContext.Provider>
  );
}

// 🔹 Hook pour utiliser les expenses
export function useExpenses() {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error(
      "useExpenses doit être utilisé à l'intérieur d'un ExpenseProvider"
    );
  }
  return context;
}

// 🔹 Hook pour accéder uniquement aux actions
export function useExpenseActions() {
  const {
    handleCreateExpense,
    handleUpdateExpense,
    handleDeleteExpense,
    showNotification,
  } = useExpenses();
  return {
    handleCreateExpense,
    handleUpdateExpense,
    handleDeleteExpense,
    showNotification,
  };
}
