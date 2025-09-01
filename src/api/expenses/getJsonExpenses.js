
import { useEffect, useState } from "react";
import { fetchAllExpenses } from "./expenseService";

export function getJsonExpenses() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchAllExpense = async () => {
      try {
        const data2 = await fetchAllExpenses();
        setData(data2);
      } catch (error) {
        console.error("Erreur lors du fetch user:", error);
      }
    };
    fetchAllExpense();
  }, []);

  return data;
}
