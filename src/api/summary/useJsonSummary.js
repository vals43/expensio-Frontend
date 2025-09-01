import { useEffect, useState } from "react";
import { getSummary, getDailySummary, getIncomesBySource, getExpensesBySource } from "./summaryService";

export function useJsonSummary(month) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const summaryData = await getSummary(month);
        setData(summaryData);
      } catch (err) {
        console.error("Erreur lors du fetch du résumé mensuel:", err);
        setData(null); // Reset data on error
      }
    };
    fetchSummary();
  }, [month]);

  return data;
}

export function useJsonDailySummary(startDate, endDate) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchDailySummary = async () => {
      try {
        const dailySummaryData = await getDailySummary(startDate, endDate);
        setData(dailySummaryData);
      } catch (err) {
        console.error("Erreur lors du fetch du résumé journalier:", err);
        setData(null); // Reset data on error
      }
    };

    if (startDate && endDate) {
      fetchDailySummary();
    } else {
      setData(null); // Reset data if dates are missing
    }
  }, [startDate, endDate]);

  return data;
}

export function useJsonIncomesBySource() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIncomesBySource = async () => {
      try {
        setLoading(true);
        const incomesData = await getIncomesBySource();
        setData(incomesData);
        setError(null);
      } catch (err) {
        console.error("Erreur lors du fetch des revenus par source:", err);
        setError(err.message);
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchIncomesBySource();
  }, []);

  return { data, loading, error };
}
export function useJsonExpensesBySource() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExpensesBySource = async () => {
      try {
        setLoading(true);
        const incomesData = await getExpensesBySource();
        setData(incomesData);
        setError(null);
      } catch (err) {
        console.error("Erreur lors du fetch des expenses par categories:", err);
        setError(err.message);
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchExpensesBySource();
  }, []);

  return { data, loading, error };
}
