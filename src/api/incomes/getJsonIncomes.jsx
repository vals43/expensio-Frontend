import { useEffect, useState, createContext, useContext } from "react";
import {
  fetchAllIncomes,
  createNewIncome,
  updateExistingIncome,
  deleteExistingIncome,
} from "./incomeService";

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

// 🔹 Provider pour envelopper ton app
export function IncomeProvider({ children }) {
  const [incomes, setIncomes] = useState([]);

  // 🔹 Fetch initial des revenus
  useEffect(() => {
    const fetchIncomes = async () => {
      try {
        const data = await fetchAllIncomes();
        setIncomes(data || []);
      } catch (error) {
        console.error("Erreur lors du fetch des revenus :", error);
      }
    };
    fetchIncomes();
  }, []);

  // 🔹 Actions sur les revenus
  const handleCreateIncome = async (newIncomeData) => {
    try {
      const response = await createNewIncome(newIncomeData);
      setIncomes(prev => [...prev, response]); // update local state
      return response;
    } catch (error) {
      console.error("Erreur lors de la création du revenu:", error);
      throw error;
    }
  };

  const handleUpdateIncome = async (id, updatedData) => {
    try {
      const response = await updateExistingIncome(id, updatedData);
      setIncomes(prev =>
        prev.map(income => (income.id === id ? response : income))
      );
      return response;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du revenu:", error);
      throw error;
    }
  };

  const handleDeleteIncome = async (id) => {
    try {
      await deleteExistingIncome(id);
      setIncomes(prev => prev.filter(income => income.id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression du revenu:", error);
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
      }}
    >
      {children}
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
  const { handleCreateIncome, handleUpdateIncome, handleDeleteIncome } = useIncomes();
  return { handleCreateIncome, handleUpdateIncome, handleDeleteIncome };
}
