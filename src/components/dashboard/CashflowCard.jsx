"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useTheme } from "../theme/ThemeProvider"
import { ChevronDownIcon } from "lucide-react"
import { Line, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, ComposedChart } from "recharts"

export function CashflowCard({ sumExpenses = 0, sumIncome = 0, balanceMonthly }) {
  const { theme } = useTheme()
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false)
  const [filter, setFilter] = useState("daily")

  const dailyData = [
    { month: "01-01-25", income: 2500, expense: 1800 },
    { month: "02-01-25", income: 2200, expense: 1600 },
    { month: "03-01-25", income: 2800, expense: 2100 },
    { month: "04-01-25", income: 3200, expense: 2400 },
    { month: "05-01-25", income: 2900, expense: 2200 },
    { month: "06-01-25", income: 3100, expense: 2300 },
    { month: "07-01-25", income: 3400, expense: 2500 },
    { month: "08-01-25", income: 3600, expense: 2700 },
    { month: "09-01-25", income: 3300, expense: 2400 },
    { month: "10-01-25", income: 3000, expense: 2200 },
    { month: "11-01-25", income: 2800, expense: 2000 },
    { month: "12-01-25", income: 3500, expense: 2600 },
  ]

  const monthlyData = [
    { month: "Jan", income: 45000, expense: 32000 },
    { month: "Feb", income: 38000, expense: 28000 },
    { month: "Mar", income: 52000, expense: 38000 },
    { month: "Apr", income: 48000, expense: 35000 },
    { month: "May", income: 55000, expense: 40000 },
    { month: "Jun", income: 58000, expense: 42000 },
    { month: "Jul", income: 62000, expense: 45000 },
    { month: "Aug", income: 59000, expense: 43000 },
  ]

  const data = filter === "daily" ? dailyData : monthlyData

  const filterOptions = [
    { label: "Daily", value: "daily" },
    { label: "Monthly", value: "monthly" },
  ]

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter)
    setYearDropdownOpen(false)
  }

  // Chart theme for Recharts-specific properties
  const chartTheme = theme === "dark" ? {
    grid: "#333333",
    tooltipBg: "#1e1e1e",
    tooltipBorder: "none",
    textColor: "#e0e0e0",
    background: "#0a0a0a",
  } : {
    grid: "#d1d5db",
    tooltipBg: "#ffffff",
    tooltipBorder: "1px solid #e5e7eb",
    textColor: "#374151",
    background: "#f9fafb",
  }

  return (
    <motion.div
      whileHover={{ boxShadow: theme === "dark" ? "0 4px 12px rgba(0, 0, 0, 0.3)" : "0 4px 12px rgba(0, 0, 0, 0.1)" }}
      className="rounded-xl p-6 hover:scale-105 transition-all duration-500 bg-light-card dark:bg-dark-card border border-gray-200 dark:border-gray-800"
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Performance Tracker
          </h3>
        </div>
        <div className="flex space-x-2">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleFilterChange(option.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === option.value
                  ? "bg-gray-900 text-white dark:bg-white dark:text-black"
                  : "bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-6 mb-6">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">Income</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">Expense</span>
        </div>
      </div>

      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
            <defs>
              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.1} />
              </linearGradient>
            </defs>

            <CartesianGrid horizontal={true} vertical={false} stroke={chartTheme.grid} strokeDasharray="2 2" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: chartTheme.textColor }}
            />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: chartTheme.textColor }} />
            <Tooltip
              contentStyle={{
                backgroundColor: chartTheme.tooltipBg,
                border: chartTheme.tooltipBorder,
                borderRadius: "8px",
                boxShadow: theme === "dark" ? "0 4px 12px rgba(0, 0, 0, 0.3)" : "0 4px 12px rgba(0, 0, 0, 0.1)",
                color: chartTheme.textColor,
              }}
            />

            <Area type="monotone" dataKey="expense" stroke="#3b82f6" strokeWidth={2} fill="url(#expenseGradient)" />
            <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth= {2} dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}