import { useMemo, useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { useTheme } from "../theme/ThemeProvider"

import {  useJsonDailySummary } from '../../api/summary/useJsonSummary';

function formatSummaryData(monthlySummaryArray) {
  return monthlySummaryArray.map(summary => {
    const { month, totals } = summary;

    const { expenses, income, balance } = totals;

    return {
      month,
      expenses,
      income,
      balance
    };
  });
}

export const CashflowCard = ({ monthlyData, "data-id": dataId }) => {
  const theme = useTheme().theme
  const axisColor = theme === "light" ? "#333333" : "#e5e7eb"
  const [viewMode, setViewMode] = useState("monthly")

  const today = new Date();

  const options = { year: 'numeric', month: 'long' };
  const formattedDate = new Intl.DateTimeFormat('en-US', options).format(today);

  
  const year = new Date().toISOString().split('-')[0];
  const mois = new Date().toISOString().split('-')[1];

  const sampleDailyData = useJsonDailySummary(`${year}-${mois}-01`,`${year}-${Number(mois)+1}-01`)

  
  const sampleMonthlyData = formatSummaryData(monthlyData)
  
  
  
  
  const currentData = viewMode === "monthly" ? sampleMonthlyData : null
  const currentDailyData = viewMode === "daily" ? sampleDailyData : []

  const currentMonthData = sampleMonthlyData[Number(mois)-1]

  const dailySummary = useMemo(() => {
    if (currentDailyData.length === 0) return null
    const totalIncome = currentDailyData.reduce((sum, day) => sum + day.incomes, 0)
    const totalExpenses = currentDailyData.reduce((sum, day) => sum + day.expenses, 0)
    const netBalance = totalIncome - totalExpenses
    const avgDailyExpenses = totalExpenses / currentDailyData.length
    return { totalIncome, totalExpenses, netBalance, avgDailyExpenses, daysTracked: currentDailyData.length }
  }, [currentDailyData])



  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount)

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" })

  const monthlyChartData = currentData || []
  const dailyChartData = currentDailyData.map((d) => ({
    date: formatDate(d.date),
    income: d.incomes,
    expenses: d.expenses,
    balance: d.balance,
  }))

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div className="p-3 rounded-xl border bg-light-card dark:bg-dark-card text-popover-foreground shadow-xl text-xs sm:text-sm">
          <p className="font-semibold mb-1">{label}</p>
          {payload.map((entry, i) => (
            <p key={i} style={{ color: entry.color }} className="font-medium">
              {entry.dataKey}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="text-foreground transition-all" data-id={dataId}>
      <div className="lg:p-8">
        {/* Single Card */}
        <div className="rounded-2xl bg-light-card dark:bg-dark-card p-4 sm:p-6 lg:p-8 shadow-lg">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">
              {viewMode === "monthly" ? "Monthly Overview" : "Daily Trends"}
            </h2>

            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              className="px-3 py-2 rounded-lg border bg-light-card dark:bg-dark-card text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="monthly">📅 Monthly</option>
              <option value="daily">📊 Daily</option>
            </select>
          </div>

          {/* Chart */}
          <div className="h-52 sm:h-56 lg:h-60 min-w-[300px] mb-8">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={viewMode === "monthly" ? monthlyChartData : dailyChartData}
                margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
                <XAxis
                  dataKey={viewMode === "monthly" ? "month" : "date"}
                  stroke={axisColor}
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke={axisColor}
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `$${v}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: "0.75rem" }} />
                <Bar dataKey="income" fill="#22c55e" radius={[2, 2, 0, 0]} name="Income" />
                <Bar dataKey="expenses" fill="#ef4444" radius={[2, 2, 0, 0]} name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Metrics table below chart */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm sm:text-base border-collapse">
              <thead>
                <tr className="text-left text-muted-foreground border-b">
                  <th className="py-2">Total Income</th>
                  <th className="py-2">Total Expenses</th>
                  {
                    viewMode === "monthly" ?
                  <th className="py-2">Current month</th> 
                  :
                  <th className="py-2">Avg Daily Spend</th> 
                    
                  }
                </tr>
              </thead>
              <tbody>
                {viewMode === "monthly" && currentMonthData && (
                  <>
                    <tr className="">
                      <td className="py-2 font-semibold text-green-600">
                        {formatCurrency(currentMonthData.income)}
                      </td>
                      <td className="py-2 font-semibold text-red-600">
                        {formatCurrency(currentMonthData.expenses)}
                      </td>
                      <td className="py-2 font-semibold">{formattedDate}</td>
                    </tr>
                  </>
                )}

                {viewMode === "daily" && dailySummary && (
                  <>
                    <tr className="">
                      <td className="py-2 font-semibold text-green-600">
                        {formatCurrency(dailySummary.totalIncome)}
                      </td>
                      <td className="py-2 font-semibold text-red-600">
                        {formatCurrency(dailySummary.totalExpenses)}
                      </td>
                      <td className="py-2 font-semibold text-purple-600">
                        {formatCurrency(dailySummary.avgDailyExpenses)}
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
