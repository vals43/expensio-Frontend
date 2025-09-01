import React, { useEffect, useState, createContext, useContext } from 'react';
import { useJsonUser } from '../api/user/useJsonUser';
const TransactionContext = createContext(undefined);
export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};
export const TransactionProvider =   ({
  children
}) => {
  const user = useJsonUser()
  const [transactions, setTransactions] = useState([]);
  // Load transactions from localStorage when user changes
  useEffect(() => {
    if (user) {
      const savedTransactions = localStorage.getItem(`transactions_1`);
      if (savedTransactions) {
        setTransactions(JSON.parse(savedTransactions));
      } else {
        // Add some sample data for demo purposes
        const sampleTransactions = generateSampleTransactions(user.id);
        setTransactions(sampleTransactions);
        localStorage.setItem(`transactions_${user.id}`, JSON.stringify(sampleTransactions));
      }
    } else {
      setTransactions([]);
    }
  }, [user]);
  // Save transactions to localStorage whenever they change
  useEffect(() => {
    if (user) {
      localStorage.setItem(`transactions_${user.id}`, JSON.stringify(transactions));
    }
  }, [transactions, user]);
  const addTransaction = (transaction) => {
    if (!user) return;
    const newTransaction = {
      ...transaction,
      id: `transaction-${Date.now()}`,
      userId: user.id
    };
    setTransactions(prev => [...prev, newTransaction]);
  };
  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(transaction => transaction.id !== id));
  };
  const getTransactionsByType = (type) => {
    return transactions.filter(transaction => transaction.type === type);
  };
  const getTotalByType = (type) => {
    return getTransactionsByType(type).reduce((total, transaction) => total + transaction.amount, 0);
  };
  const getBalance = () => {
    return getTotalByType('income') - getTotalByType('expense');
  };
  const getRecentTransactions = (limit = 5) => {
    return [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, limit);
  };
  const getCategorySummary = (type) => {
    const filteredTransactions = getTransactionsByType(type);
    const categories = {};
    filteredTransactions.forEach(transaction => {
      if (categories[transaction.category]) {
        categories[transaction.category] += transaction.amount;
      } else {
        categories[transaction.category] = transaction.amount;
      }
    });
    return Object.entries(categories).map(([category, amount]) => ({
      category,
      amount
    }));
  };
  return <TransactionContext.Provider value={{
    transactions,
    addTransaction,
    deleteTransaction,
    getTransactionsByType,
    getTotalByType,
    getBalance,
    getRecentTransactions,
    getCategorySummary
  }}>
      {children}
    </TransactionContext.Provider>;
};
// Helper function to generate sample transactions for demo purposes
function generateSampleTransactions(userId) {
  const categories = {
    income: ['Salary', 'Freelance', 'Investments', 'Gift', 'Other'],
    expense: ['Food', 'Housing', 'Transportation', 'Entertainment', 'Utilities', 'Healthcare', 'Shopping']
  };
  const getRandomDate = (days) => {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * days));
    return date.toISOString().split('T')[0];
  };
  const getRandomCategory = (type) => {
    const typeCategories = type === 'income' ? categories.income : categories.expense;
    return typeCategories[Math.floor(Math.random() * typeCategories.length)];
  };
  const transactions = [];
  // Generate 5 income transactions
  for (let i = 0; i < 5; i++) {
    transactions.push({
      id: `sample-income-${i}`,
      userId,
      type: 'income',
      amount: Math.floor(Math.random() * 1000) + 500,
      category: getRandomCategory('income'),
      description: `Sample income ${i + 1}`,
      date: getRandomDate(30)
    });
  }
  // Generate 8 expense transactions
  for (let i = 0; i < 8; i++) {
    transactions.push({
      id: `sample-expense-${i}`,
      userId,
      type: 'expense',
      amount: Math.floor(Math.random() * 200) + 50,
      category: getRandomCategory('expense'),
      description: `Sample expense ${i + 1}`,
      date: getRandomDate(30)
    });
  }
  return transactions;
}