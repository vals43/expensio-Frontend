// src/context/incomeContext.jsx
import { useEffect, useState, createContext, useContext } from "react";
import { useLocation } from "react-router-dom"; // ← Ajout pour refetch sur route change
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
    const fetchAllData = async () => { // ← Corrigé : était "fetchAllExpense" (typo)
      try {
        const data2 = await fetchAllIncomes();
        setData(data2);
      } catch (error) {
        console.error("Erreur lors du fetch des revenus :", error);
      }
    };
    fetchAllData();
  }, []);

  return data;
}

// 🔹 Context pour les incomes
const IncomeContext = createContext();

export function IncomeProvider({ children }) {
  const [incomes, setIncomes] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // ← Ajout pour UX loading
  const location = useLocation(); // ← Récupère la route actuelle

  // 🔹 Notification modal state
  const [notification, setNotification] = useState({ isOpen: false, type: "success", message: "" });

  // 🔹 Fetch initial ET à chaque route change
  useEffect(() => {
    const fetchIncomes = async () => {
      setIsLoading(true); // ← Début loading
      try {
        const data = await fetchAllIncomes();
        setIncomes(data || []);
      } catch (error) {
        console.error("Erreur lors du fetch des revenus :", error);
        // ← Condition : Pas de notif sur login/signup
        if (!["/login", "/signup"].includes(location.pathname)) {
          showNotification("error", "Failed to fetch incomes");
        }
      } finally {
        setIsLoading(false); // ← Fin loading
      }
    };
    fetchIncomes();
  }, [location.pathname]); // ← Dépendance : Refetch à chaque pathname change

  // 🔹 Fonction refetch manuelle
  const refetchIncomes = async () => {
    await fetchIncomes(); // Réutilise la logique ci-dessus
  };

  // 🔹 Helper pour ouvrir la notification
  const showNotification = (type, message) => {
    // ← Condition : Pas de notif sur login/signup
    if (["/login", "/signup"].includes(location.pathname)) return;
    setNotification({ isOpen: true, type, message });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, isOpen: false }));
    }, 2500); // auto close après 2.5s
  };

  // 🔹 Actions sur les revenus (inchangées, mais ajout condition notif)
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
        isLoading, // ← Exposé pour spinner
        refetchIncomes, // ← Pour refetch manuel
        handleCreateIncome,
        handleUpdateIncome,
        handleDeleteIncome,
        showNotification, // pour usage manuel si besoin
      }}
    >
      {children}

      {/* Notification Modal : Conditionnel pour login/signup */}
      {notification.isOpen && !["/login", "/signup"].includes(location.pathname) && (
        <NotificationModal
          isOpen={notification.isOpen}
          onClose={() => setNotification(prev => ({ ...prev, isOpen: false }))}
          type={notification.type}
          message={notification.message}
        />
      )}
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