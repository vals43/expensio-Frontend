import React, { useState } from 'react';
import { useTransactions } from '../context/TransactionContext';
import TransactionList from '../components/transaction/TransactionList';
import TransactionForm from '../components/transaction/TransactionForm';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import { PlusIcon, ChartBarIcon, PieChartIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import ExpenseActivityCard from '../components/card/ExpenseActivityCard';
import { getJsonIncomes } from '../api/incomes/getJsonIncomes';
import { useJsonDailySummary, useJsonIncomesBySource, useJsonSummary } from '../api/summary/useJsonSummary';




const Income = () => {

  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeView, setActiveView] = useState('list');
  const incomes = getJsonIncomes();
  const summary = useJsonSummary()
  const categorySummary = useJsonIncomesBySource().data;
  const daily = useJsonDailySummary('2024-08-01','2026-08-01')

  if (!incomes) {
    return (
      <div className="bg-light-card dark:bg-dark-card p-6 rounded-xl shadow-sm text-center text-light-text dark:text-dark-text">
        <p className="text-gray-500 dark:text-gray-400">Chargement des incomes ...</p>
      </div>
    );
  }
  if (!categorySummary) {
    return (
      <div className="bg-light-card dark:bg-dark-card p-6 rounded-xl shadow-sm text-center text-light-text dark:text-dark-text">
        <p className="text-gray-500 dark:text-gray-400">Chargement des categories ...</p>
      </div>
    );
  }
  
  if (!summary) {
    return (
      <div className="bg-light-card dark:bg-dark-card p-6 rounded-xl shadow-sm text-center text-light-text dark:text-dark-text">
        <p className="text-gray-500 dark:text-gray-400">Chargement des summary ...</p>
      </div>
    );
  }
  
  if (!daily) {
    return (
      <div className="bg-light-card dark:bg-dark-card p-6 rounded-xl shadow-sm text-center text-light-text dark:text-dark-text">
        <p className="text-gray-500 dark:text-gray-400">Chargement des daily ...</p>
      </div>
    );
  }

  
  

  const formatDailyIncomes = (dailyData) => {
    if (!dailyData || !Array.isArray(dailyData)) {
      return [];
    }
  
    const filteredData = dailyData.filter(day => day.incomes !== 0);
  
    const formattedData = filteredData.map(day => ({
      name: day.date,
      value: day.incomes
    }));
  
    return formattedData;
  };
  const data = formatDailyIncomes(daily)
  
  
  
  
  const totalIncome = incomes.reduce((total, income) => total + Number(income.amount), 0);
  
  
  


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Income
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track and manage your income sources
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-1 flex">
            <button onClick={() => setActiveView('list')} className={`px-3 py-1 rounded ${activeView === 'list' ? 'bg-indigo-600 dark:bg-indigo-400 text-white' : 'text-gray-600 dark:text-gray-400'}`}>
              <ChartBarIcon className="h-5 w-5" />
            </button>
            <button onClick={() => setActiveView('summary')} className={`px-3 py-1 rounded ${activeView === 'summary' ? 'bg-indigo-600 dark:bg-indigo-400 text-white' : 'text-gray-600 dark:text-gray-400'}`}>
              <PieChartIcon className="h-5 w-5" />
            </button>
          </div>
          <Button onClick={() => setIsModalOpen(true)} icon={<PlusIcon className="h-5 w-5" />}>
            Add Income
          </Button>
        </div>
      </div>
      {activeView === 'list' ? <TransactionList transactions={incomes} type="income" /> : <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 p-6 bg-white dark:bg-dark-card">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            Income Breakdown
          </h3>
          <div className="space-y-4">
            {categorySummary.map((item, index) => {
              const percentage = Math.round(item.totalAmount / totalIncome * 100) || 0;
              return <div key={item.source}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {item.source}
                  </span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {percentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <motion.div className="bg-green-600 dark:bg-green-500 h-2 rounded-full" initial={{
                    width: 0
                  }} animate={{
                    width: `${percentage}%`
                  }} transition={{
                    duration: 0.5,
                    delay: index * 0.1
                  }} />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {item.totalAmount} Ar
                </p>
              </div>;
            })}
          </div>
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between">
              <span className="font-medium text-gray-900 dark:text-gray-100">
                Total Income
              </span>
              <span className="font-medium text-green-600 dark:text-green-500">
                {totalIncome} Ar
              </span>
            </div>
          </div>
        </Card>

        <Card className="md:col-span-2 p-6 bg-white dark:bg-dark-card">
          <ExpenseActivityCard data={data} />
        </Card>
        <Card className="md:col-span-2 p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            Add New Income
          </h3>
          <TransactionForm type="income" />
        </Card>
      </div>}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Income" maxWidth="md">
        <TransactionForm type="income" onSuccess={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );

};
export default Income;