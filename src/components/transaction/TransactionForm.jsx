"use client"

import { useState, useEffect } from "react"
import Button from "../ui/Button"
import {
  PlusIcon,
  CalendarIcon,
  TagIcon,
  DollarSignIcon,
  FileTextIcon,
  XIcon,
  PencilIcon,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const TransactionForm = ({ onSubmit, initialData = null, onClose }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    amount: "",
    source: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  })
  const [errors, setErrors] = useState({})
  const [submissionError, setSubmissionError] = useState("")

  useEffect(() => {
    if (initialData) {
      setFormData({
        amount: String(initialData.amount),
        source: initialData.source || "",
        description: initialData.description || "",
        date: initialData.date?.split("T")[0] || new Date().toISOString().split("T")[0],
      })
      setErrors({})
      setSubmissionError("")
    } else {
      setFormData({
        amount: "",
        source: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
      })
    }
  }, [initialData])

  const validateForm = () => {
    const newErrors = {}
    if (!formData.amount || isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = "Please enter a valid amount"
    }
    if (!formData.source) {
      newErrors.source = "Please select a source"
    }
    if (!formData.date) {
      newErrors.date = "Please select a date"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }))
    setSubmissionError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsLoading(true)
    setSubmissionError("")

    try {
      const transactionData = { ...formData, amount: Number(formData.amount) }
      if (onSubmit) {
        await onSubmit(transactionData)
      }
      onClose?.()
    } catch (error) {
      console.error("Error submitting form:", error)
      setSubmissionError("Failed to submit the form. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const incomeCategories = ["Salary", "Freelance", "Investments", "Gift", "Other"]

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl rounded-2xl border border-gray-200 dark:border-gray-700"
          onClick={(e) => e.stopPropagation()}
        >
          {/* bouton X */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-700 hover:bg-gray-200 dark:hover:text-gray-200 transition"
          >
            <XIcon className="w-5 h-5" />
          </button>

          {/* contenu */}
          <div className="p-6">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl m-auto font-bold text-gray-900 dark:text-white">
                {initialData ? "Update Income" : "Add New Income"}
              </h2>
            </div>
            <p className="text-sm flex justify-around text-gray-600 dark:text-gray-400 mb-6">
              Track your financial progress
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {submissionError && (
                <p className="text-sm text-red-500">{submissionError}</p>
              )}

              {/* Amount */}
              <div className="relative">
                <label className="block text-sm font-semibold mb-1">Amount *</label>
                <div className="relative">
                  <DollarSignIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                {errors.amount && <p className="text-xs text-red-500">{errors.amount}</p>}
              </div>

              {/* Source */}
              <div className="relative">
                <label className="block text-sm font-semibold mb-1">Source *</label>
                <div className="relative">
                  <TagIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <select
                    name="source"
                    value={formData.source}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select a source</option>
                    {incomeCategories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                {errors.source && <p className="text-xs text-red-500">{errors.source}</p>}
              </div>

              {/* Date */}
              <div className="relative">
                <label className="block text-sm font-semibold mb-1">Date *</label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                {errors.date && <p className="text-xs text-red-500">{errors.date}</p>}
              </div>

              {/* Description */}
              <div className="relative">
                <label className="block text-sm font-semibold mb-1">
                  Description (Optional)
                </label>
                <div className="relative">
                  <FileTextIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Submit */}
              <Button type="submit" disabled={isLoading} className="w-full mt-4">
                {isLoading ? "Processing..." : initialData ? "Update Income" : "Add Income"}
              </Button>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default TransactionForm
