import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../theme/ThemeProvider';
import { ChevronDownIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine, Tooltip } from 'recharts';

export function CashflowCard( {sumExpenses = 0, sumIncome = 0 , balanceMonthly}) {
  const { theme } = useTheme();
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);
  const [filter, setFilter] = useState('all');

  const data = [{
    month: 'Jan',
    income: 56000,
    expense: 42000
  }, {
    month: 'Feb',
    income: 48000,
    expense: 36000
  }, {
    month: 'Mar',
    income: 52000,
    expense: 38000
  }, {
    month: 'Apr',
    income: 60000,
    expense: 44000
  }, {
    month: 'May',
    income: 54000,
    expense: 40000
  }, {
    month: 'Jun',
    income: 56000,
    expense: 42000
  }, {
    month: 'Jul',
    income: 58000,
    expense: 43000
  }, {
    month: 'Aug',
    income: 62000,
    expense: 46000
  }, {
    month: 'Sep',
    income: 60000,
    expense: 44000
  }, {
    month: 'Oct',
    income: 58000,
    expense: 43000
  }, {
    month: 'Nov',
    income: 56000,
    expense: 42000
  }, {
    month: 'Dec',
    income: 60000,
    expense: 44000
  }];

  const filterOptions = [
    { label: 'All', value: 'all' },
    { label: 'Income', value: 'income' },
    { label: 'Expense', value: 'expense' },
  ];

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setYearDropdownOpen(false);
  };

  const chartTheme = theme === 'dark' ? {
    grid: '#333',
    tooltipBg: '#1e1e1e',
    tooltipBorder: 'none',
    textColor: '#e0e0e0'
  } : {
    grid: '#eee',
    tooltipBg: 'white',
    tooltipBorder: '1px solid #ddd',
    textColor: '#333333'
  };

  return (
    <motion.div
      whileHover={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}
      className="rounded-xl p-4 hover:scale-105 transition-all duration-500 bg-light-card dark:bg-dark-card"
    >
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-2xl font-bold text-light-text dark:text-dark-text">This month</h3>
          <h2 className=" p-2 font-light text-sm text-light-text dark:text-dark-text">Balance : <span className='text-sm font-bold'>{balanceMonthly} Ar</span></h2>
        </div>
        <div className="relative">
          <button
            onClick={() => setYearDropdownOpen(!yearDropdownOpen)}
            className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text hover:bg-light-border dark:hover:bg-dark-border"
          >
            <span className="text-sm">
              {filterOptions.find(opt => opt.value === filter)?.label}
            </span>
            <ChevronDownIcon size={16} />
          </button>
          {yearDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-1 py-1 rounded-lg shadow-lg z-10 w-32 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border"
            >
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  className="w-full text-left px-3 py-1 text-sm text-light-text dark:text-dark-text hover:bg-light-background dark:hover:bg-dark-background"
                  onClick={() => handleFilterChange(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-6 mb-4">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-sm bg-green-500 mr-2"></div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Income</p>
            <p className="text-sm font-medium text-light-text dark:text-dark-text">{sumIncome} Ar</p>
          </div>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-sm bg-red-500 mr-2"></div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Expense</p>
            <p className="text-sm font-medium text-light-text dark:text-dark-text">{sumExpenses} Ar</p>
          </div>
        </div>
      </div>
      <div className="h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
            barGap={0}
          >
            <CartesianGrid vertical={false} stroke={chartTheme.grid} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: chartTheme.textColor }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: chartTheme.textColor }}
              tickFormatter={value => `${value / 1000}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: chartTheme.tooltipBg,
                border: chartTheme.tooltipBorder,
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}
              formatter={value => [`$${value.toLocaleString()}`, '']}
            />
            <ReferenceLine y={0} stroke={chartTheme.grid} />
            {(filter === 'all' || filter === 'income') && (
              <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} />
            )}
            {(filter === 'all' || filter === 'expense') && (
              <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}