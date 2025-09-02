// src/context/incomeContext.jsx
import { useEffect, useState, createContext, useContext } from "react";
import {
  fetchAllIncomes,
  createNewIncome,
  updateExistingIncome,
  deleteExistingIncome,
} from "./incomeService";
import { NotificationModal } from "../../components/ui/NotificationModal";

export function getJsonIncomes() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchAllExpense = async () => {
      try {
        const data2 = await fetchAllIncomes();
        setData(data2);
      } catch (error) {
        console.error("Erreur lors du fetch des revenus :", error);
      }
    };
    fetchAllExpense();
  }, []);

  return data;
}

// 🔹 Context pour les incomes
const IncomeContext = createContext();

export function IncomeProvider({ children }) {
  const [incomes, setIncomes] = useState([]);

  // 🔹 Notification modal state
  const [notification, setNotification] = useState({ isOpen: false, type: "success", message: "" });

  // 🔹 Fetch initial des revenus
  useEffect(() => {
    const fetchIncomes = async () => {
      try {
        const data = await fetchAllIncomes();
        setIncomes(data || []);
      } catch (error) {
        console.error("Erreur lors du fetch des revenus :", error);
        showNotification("error", "Failed to fetch incomes");
      }
    };
    fetchIncomes();
  }, []);

  // 🔹 Helper pour ouvrir la notification
  const showNotification = (type, message) => {
    setNotification({ isOpen: true, type, message });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, isOpen: false }));
    }, 2500); // auto close après 2.5s
  };

  // 🔹 Actions sur les revenus
  const handleCreateIncome = async (newIncomeData) => {
    try {
      const response = await createNewIncome(newIncomeData);
      setIncomes(prev => [...prev, response]);
      showNotification("success", "Income added successfully");
      return response;
    } catch (error) {
      console.error("Erreur lors de la création du revenu:", error);
      showNotification("error", "Failed to add income");
      throw error;
    }
  };

  const handleUpdateIncome = async (id, updatedData) => {
    try {
      const response = await updateExistingIncome(id, updatedData);
      setIncomes(prev => prev.map(income => (income.id === id ? response : income)));
      showNotification("success", "Income updated successfully");
      return response;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du revenu:", error);
      showNotification("error", "Failed to update income");
      throw error;
    }
  };

  const handleDeleteIncome = async (id) => {
    try {
      await deleteExistingIncome(id);
      setIncomes(prev => prev.filter(income => income.id !== id));
      showNotification("success", "Income deleted successfully");
    } catch (error) {
      console.error("Erreur lors de la suppression du revenu:", error);
      showNotification("error", "Failed to delete income");
      throw error;
    }
  };

  return (
    <IncomeContext.Provider
      value={{
        incomes,
        handleCreateIncome,
        handleUpdateIncome,
        handleDeleteIncome,
        showNotification, // pour usage manuel si besoin
      }}
    >
      {children}

      {/* Notification Modal */}
      <NotificationModal
        isOpen={notification.isOpen}
        onClose={() => setNotification(prev => ({ ...prev, isOpen: false }))}
        type={notification.type}
        message={notification.message}
      />
    </IncomeContext.Provider>
  );
}

// 🔹 Hook pour utiliser les incomes
export function useIncomes() {
  const context = useContext(IncomeContext);
  if (!context) {
    throw new Error("useIncomes doit être utilisé à l'intérieur d'un IncomeProvider");
  }
  return context;
}

// 🔹 Hook pour accéder uniquement aux actions
export function useIncomeActions() {
  const { handleCreateIncome, handleUpdateIncome, handleDeleteIncome, showNotification } = useIncomes();
  return { handleCreateIncome, handleUpdateIncome, handleDeleteIncome, showNotification };
}
