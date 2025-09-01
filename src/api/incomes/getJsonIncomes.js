import { useEffect, useState } from "react";
import { fetchAllIncomes , createNewIncome, updateExistingIncome, deleteExistingIncome  } from "./incomeService";

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

export function useIncomeActions(onSuccess) {
  const handleCreateIncome = async (newIncomeData) => {
    try {
      const response = await createNewIncome(newIncomeData);
      if (onSuccess) {
        onSuccess();
      }
      return response;
    } catch (error) {
      console.error("Erreur lors de la création du revenu:", error);
      throw error;
    }
  };

  const handleUpdateIncome = async (id, updatedData) => {
    try {
      const response = await updateExistingIncome(id, updatedData);
      if (onSuccess) {
        onSuccess();
      }
      return response;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du revenu:", error);
      throw error;
    }
  };

  const handleDeleteIncome = async (id) => {
    try {
      await deleteExistingIncome(id);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du revenu:", error);
      throw error;
    }
  };

  return {
    handleCreateIncome,
    handleUpdateIncome,
    handleDeleteIncome,
  };
}
