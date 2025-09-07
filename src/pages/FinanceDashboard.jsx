import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CashflowCard } from '../components/dashboard/CashflowCard';
import { UserProfileCard } from '../components/dashboard/UserProfileCard';
import { StatisticsCard } from '../components/dashboard/StatisticsCard';
import StatsCard from '../components/card/StatsCard';
import { LineChart } from '../components/charts/LineChart';
import { TransactionCard } from '../components/card/TransactionCard';
import { Calendar, CreditCardIcon, RefreshCcw } from 'lucide-react';
import { ActionButtonsCard } from './../components/dashboard/ActionButtonsCard';
import { useJsonUser } from '../api/user/useJsonUser.js';
import { useJsonDailySummary, useJsonSummary } from '../api/summary/useJsonSummary.js';
import { getJsonExpenses } from '../api/expenses/expenseContext.jsx';
import { getJsonIncomes } from '../api/incomes/getJsonIncomes.jsx';
import BudgetAlertsDashboard from '../components/dashboard/budget-alerts-dashboard.jsx';
import Button from '../components/ui/Button.jsx';

const upTrendData = [{
  name: 'Jan',
  value: 100
}, {
  name: 'Feb',
  value: 120
}, {
  name: 'Mar',
  value: 110
}, {
  name: 'Apr',
  value: 140
}, {
  name: 'May',
  value: 160
}];
const downTrendData = [{
  name: 'Jan',
  value: 200
}, {
  name: 'Feb',
  value: 180
}, {
  name: 'Mar',
  value: 190
}, {
  name: 'Apr',
  value: 150
}, {
  name: 'May',
  value: 130
}];
const transactions = [{
  id: 1,
  title: 'test',
  subtitle: 'test category',
  icon: <CreditCardIcon size={20} />,
  date: '2025-10-24',
  isIncome: true,
  amount: 100
},
{
  id: 2,
  title: 'test',
  subtitle: 'test category',
  icon: <CreditCardIcon size={20} />,
  date: '2025-10-24',
  isIncome: false,
  amount: 100
},
]

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
const formatDailyExpenses = (dailyData) => {
  if (!dailyData || !Array.isArray(dailyData)) {
    return [];
  }

  const filteredData = dailyData.filter(day => day.expenses !== 0);

  const formattedData = filteredData.map(day => ({
    name: day.date,
    value: day.expenses
  }));

  return formattedData;
};

export function FinanceDashboard() {
  const user = useJsonUser();
  const summary = useJsonSummary();
  const expenses = getJsonExpenses();
  const incomes = getJsonIncomes();

  const year = new Date().toISOString().split('-')[0];
  const mois = new Date().toISOString().split('-')[1];

  const dailyIncome = useJsonDailySummary(`${year}-${mois}-01`,`${year}-${Number(mois)+1}-01`)
  const dailyExpense = useJsonDailySummary(`${year}-${mois}-01`,`${year}-${Number(mois)+1}-01`)

  if (!user) {
    return (
      <div className="bg-light-card dark:bg-dark-card p-6 rounded-xl shadow-sm text-center text-light-text dark:text-dark-text">
        <p className="text-gray-500 dark:text-gray-400">Chargement du profil...</p>
      </div>
    );
  }
  if (!expenses) {
    return (
      <div className="bg-light-card dark:bg-dark-card p-6 rounded-xl shadow-sm text-center text-light-text dark:text-dark-text">
        <p className="text-gray-500 dark:text-gray-400">Chargement des depenses...</p>
      </div>
    );
  }
  if (!incomes) {
    return (
      <div className="bg-light-card dark:bg-dark-card p-6 rounded-xl shadow-sm text-center text-light-text dark:text-dark-text">
        <p className="text-gray-500 dark:text-gray-400">Chargement des revenus ...</p>
      </div>
    );
  }
  if (!summary) {
    return (
      <div className="bg-light-card dark:bg-dark-card p-6 rounded-xl shadow-sm text-center text-light-text dark:text-dark-text">
        <p className="text-gray-500 dark:text-gray-400">Chargement des stats...</p>
      </div>
    );
  }
  if (!dailyIncome) {
    return (
      <div className="bg-light-card dark:bg-dark-card p-6 rounded-xl shadow-sm text-center text-light-text dark:text-dark-text">
        <p className="text-gray-500 dark:text-gray-400">Chargement des daily ...</p>
      </div>
    );
  }
  
  let sumExpenses = summary.totals.expenses

  let sumIncomes = summary.totals.income

  let balanceMonthly = String(summary.totals.balance) // monthly
  
  const totalIncome = incomes.reduce((total, income) => total + Number(income.amount), 0);
  const totalExpenses = expenses.reduce((total, expense) => total + Number(expense.amount), 0);
  
  let balance = totalIncome - totalExpenses
  

  let trendIncome

  const dataIncome = formatDailyIncomes(dailyIncome)
  const dataExpenses = formatDailyExpenses(dailyExpense)

  
  
  
  return (
    <div className="">
            <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tableau de Bord Financier</h1>
          <p className="text-muted-foreground">Suivi de vos finances mensuelles</p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
          </span>
          <Button
            onClick={() => {
              // 🔄 juste pour simuler un refresh
              setBudgetData({ ...budgetData })
            }}
            variant="outline"
            size="sm"
          >
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4  md:p-6">
        <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5
        }}>
          <CashflowCard  sumExpenses={sumExpenses} sumIncome={sumIncomes} balanceMonthly={balanceMonthly}/>
        </motion.div>
        <div className="grid grid-cols-1 gap-4">
          <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5,
            delay: 0.1
          }}>
            <UserProfileCard name={user.firstName} balance={`${balance || "0"} Ar`} />

          </motion.div>
          
          <div className="grid grid-cols-1 gap-4">
            <motion.div initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.5,
              delay: 0.1
            }}>
              <ActionButtonsCard />
            </motion.div>
          </div>
        </div>
      </div>
      <BudgetAlertsDashboard/>
      <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5,
        delay: 0.1
      }} className='p-6'>
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`}>
          <StatsCard title="Spendings" className='bg-light-card dark:bg-dark-card' value={sumExpenses} trend={2.1} chart={<LineChart data={dataExpenses} dataKey="value" lineColor="#EF4444" height={80} showAxis={false} showDots={false} />} />
          <StatsCard title="Earnings" className='bg-light-card dark:bg-dark-card' value={sumIncomes} trend={trendIncome || 0} chart={<LineChart data={dataIncome} dataKey="value" lineColor="#10B981" height={80} showAxis={false} showDots={false} />} />
          </div>
      </motion.div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 md:p-6">
        <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5,
          delay: 0.5
        }} className="lg:col-span-5">
          <StatisticsCard />
        </motion.div>
        <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5,
          delay: 0.5
        }} className="lg:col-span-7">
          <TransactionCard className='bg-light-card dark:bg-dark-card text-light-text dark:text-dark-text' transactions={transactions} />
        </motion.div>
      </div>
    </div>
  )
}