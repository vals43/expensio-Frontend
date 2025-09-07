"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/CardFull"
import { Alert, AlertDescription, AlertTitle } from "../ui/Alert"
import Button from "../ui/Button"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { AlertTriangle, TrendingUp, RefreshCw, DollarSign } from "lucide-react"
import { getToken } from "../../api/auth/authService"

const COLORS = {
  expenses: "hsl(var(--chart-1))",
  remaining: "hsl(var(--chart-2))",
  danger: "hsl(var(--destructive))",
}

export default function BudgetAlertCard() {
  const [budgetData, setBudgetData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchBudgetAlerts = async () => {
      const token = getToken();
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("http://localhost:8080/api/summary/alerts", {
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setBudgetData(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Une erreur est survenue"
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBudgetAlerts()
  }, [])

  if (loading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="flex items-center justify-center p-8">
          <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground mr-2" />
          <span className="text-muted-foreground">Chargement...</span>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button onClick={fetchBudgetAlerts} className="mt-4 w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            Réessayer
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (!budgetData) return null

  const { alert, message, details } = budgetData
  const { income, expenses } = details.totals
  const expenseRatio = income > 0 ? (expenses / income) * 100 : 0
  const remaining = Math.max(0, income - expenses)

  // Prepare pie chart data
  const pieData = [
    {
      name: "Dépenses",
      value: expenses,
      color: alert ? COLORS.danger : COLORS.expenses,
      percentage: expenseRatio.toFixed(1),
    },
    {
      name: "Restant",
      value: remaining,
      color: COLORS.remaining,
      percentage: (100 - expenseRatio).toFixed(1),
    },
  ]

  return (
    <Card className="w-full max-w-2xl mx-auto backdrop-blur-md bg-background/80 border border-border/50">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          {alert ? (
            <AlertTriangle className="h-5 w-5 text-destructive" />
          ) : (
            <TrendingUp className="h-5 w-5 text-green-600" />
          )}
          <CardTitle className="text-xl">Alerte Budget</CardTitle>
          <Button onClick={fetchBudgetAlerts} variant="ghost" size="sm">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        <span className={`text-sm font-medium px-2 py-1 rounded ${alert ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"}`}>
          {expenseRatio.toFixed(1)}% du revenu dépensé
        </span>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Message Alert */}
        <Alert variant={alert ? "destructive" : "default"} className="text-center">
          <AlertDescription className="text-base font-medium">{message}</AlertDescription>
        </Alert>

        {/* Financial Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
            <DollarSign className="h-5 w-5 text-green-600 mx-auto mb-2" />
            <p className="text-sm text-green-700 dark:text-green-400 font-medium">Revenus</p>
            <p className="text-xl font-bold text-green-800 dark:text-green-300">
              {income.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
            </p>
          </div>

          <div className="text-center p-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
            <TrendingUp className="h-5 w-5 text-red-600 mx-auto mb-2 rotate-180" />
            <p className="text-sm text-red-700 dark:text-red-400 font-medium">Dépenses</p>
            <p className="text-xl font-bold text-red-800 dark:text-red-300">
              {expenses.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
            </p>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="relative">
          <CardDescription className="text-center mb-4">Répartition des finances mensuelles</CardDescription>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={2}
                dataKey="value"
                label={({ percentage }) => `${percentage}%`}
                labelLine={false}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center text */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{expenseRatio.toFixed(0)}%</p>
              <p className="text-xs text-muted-foreground">dépensé</p>
            </div>
          </div>
        </div>

        {/* Remaining Balance */}
        <div className="text-center p-4 rounded-lg bg-muted/50 border">
          <p className="text-sm text-muted-foreground mb-1">Solde restant</p>
          <p className={`text-2xl font-bold ${remaining >= 0 ? "text-green-600" : "text-red-600"}`}>
            {remaining.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
