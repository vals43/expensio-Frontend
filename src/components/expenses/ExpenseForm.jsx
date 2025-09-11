"use client"

import { useState, useEffect } from "react"
import Button from "../ui/Button"
import {
  PlusIcon,
  CalendarIcon,
  DollarSignIcon,
  FileTextIcon,
  XIcon,
  UploadIcon,
  RepeatIcon,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useExpenseActions } from "../../api/expenses/expenseContext"
import CategoryDropdown from "../category/categoryDropdown"

// Helper function to format date to the required YYYY-MM-DDTHH:mm format
const formatToDatetimeLocal = (dateString) => {
  if (!dateString) return ""
  const date = new Date(dateString)
  // Check if date is valid
  if (isNaN(date.getTime())) return ""
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, "0")
  const day = date.getDate().toString().padStart(2, "0")
  const hours = date.getHours().toString().padStart(2, "0")
  const minutes = date.getMinutes().toString().padStart(2, "0")
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

const ExpenseForm = ({ initialData = null, onClose, isOpen }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    amount: "",
    date: formatToDatetimeLocal(new Date()),
    categoryId: "",
    description: "",
    type: "one-time",
    startDate: "",
    endDate: "",
    receipt: null,
    existingReceipt: null,
  })
  const [errors, setErrors] = useState({})
  const [submissionError, setSubmissionError] = useState("")

  const { handleCreateExpense, handleUpdateExpense } = useExpenseActions()

  useEffect(() => {
    if (!isOpen) return
    if (initialData) {
      setFormData({
        amount: initialData.amount || "",
        date: formatToDatetimeLocal(initialData.date),
        categoryId: initialData.category?.id || initialData.categoryId || "",
        description: initialData.description || "",
        type: initialData.type || "one-time",
        startDate: formatToDatetimeLocal(initialData.startDate),
        endDate: formatToDatetimeLocal(initialData.endDate),
        receipt: null,
        existingReceipt: initialData.receipt || null,
      })
      setErrors({})
      setSubmissionError("")
    } else {
      setFormData({
        amount: "",
        date: formatToDatetimeLocal(new Date()),
        categoryId: "",
        description: "",
        type: "one-time",
        startDate: "",
        endDate: "",
        receipt: null,
        existingReceipt: null,
      })
    }
  }, [initialData, isOpen])

  const validateForm = () => {
    const newErrors = {}

    // Amount is always required
    if (!formData.amount || isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = "Please enter a valid amount"
    }

    // Category is always required
    if (!formData.categoryId) {
      newErrors.categoryId = "Please select a category"
    }

    // Type-specific validation
    if (formData.type === "one-time") {
      // Date is required for one-time expenses
      if (!formData.date) {
        newErrors.date = "Please select a date for one-time expenses"
      }
    } else if (formData.type === "recurring") {
      // Start date is required for recurring expenses
      if (!formData.startDate) {
        newErrors.startDate = "Start date is required for recurring expenses"
      }
      // End date is optional for recurring expenses (ongoing if not provided)
      // But if both dates are provided, validate the relationship
      if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
        newErrors.endDate = "End date must be after start date"
      }
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

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setFormData((prev) => ({ ...prev, receipt: e.target.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsLoading(true)
    setSubmissionError("")

    try {
      const expenseData = {
        amount: Number(formData.amount),
        categoryId: formData.categoryId,
        description: formData.description || undefined,
        type: formData.type,
        receipt: formData.receipt || undefined,
      }

      // Add type-specific fields
      if (formData.type === "one-time") {
        expenseData.date = new Date(formData.date).toISOString()
      } else if (formData.type === "recurring") {
        expenseData.startDate = new Date(formData.startDate).toISOString()
        if (formData.endDate) {
          expenseData.endDate = new Date(formData.endDate).toISOString()
        }
      }

      if (initialData) {
        await handleUpdateExpense(initialData.id, expenseData)
      } else {
        await handleCreateExpense(expenseData)
      }

      if (onClose) onClose()
    } catch (error) {
      console.error("Error submitting expense:", error)
      setSubmissionError("Failed to save expense. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCloseClick = () => {
    if (onClose) onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        onClick={handleCloseClick}
      >
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative w-full max-w-4xl bg-white dark:bg-gray-900 shadow-2xl rounded-2xl border border-gray-200 dark:border-gray-700"
          onClick={(e) => e.stopPropagation()}
        >
          {/* bouton X */}
          <button
            onClick={handleCloseClick}
            className="absolute top-3 right-3 p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-700 hover:bg-gray-200 dark:hover:text-gray-200 transition"
          >
            <XIcon className="w-5 h-5" />
          </button>

          {/* contenu */}
          <div className="p-6">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl m-auto font-bold text-gray-900 dark:text-white">
                {initialData ? "Update Expense" : "Add New Expense"}
              </h2>
            </div>
            <p className="text-sm flex justify-around text-gray-600 dark:text-gray-400 mb-6">
              Track your spending with style
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {submissionError && (
                <p className="text-sm text-red-500">{submissionError}</p>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Amount */}
                <div className="relative">
                  <label className="block text-sm font-semibold mb-1">Amount *</label>
                  <div className="relative">
                    <DollarSignIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      name="amount"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={handleChange}
                      min="0.01"
                      step="0.01"
                      required
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                        errors.amount ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                  {errors.amount && <p className="text-xs text-red-500">{errors.amount}</p>}
                </div>

                {/* Type */}
                <div className="relative">
                  <label className="block text-sm font-semibold mb-1">Type</label>
                  <div className="relative">
                    <RepeatIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                    >
                      <option value="one-time">One-time</option>
                      <option value="recurring">Recurring</option>
                    </select>
                  </div>
                </div>

                {formData.type === "one-time" && (
                  <div className="lg:col-span-2 relative">
                    <label className="block text-sm font-semibold mb-1">Date *</label>
                    <div className="relative">
                      <CalendarIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="datetime-local"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                        className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                          errors.date ? "border-red-500" : ""
                        }`}
                      />
                    </div>
                    {errors.date && <p className="text-xs text-red-500">{errors.date}</p>}
                  </div>
                )}

                {/* Category - Full width */}
                <div className="lg:col-span-2">
                  <CategoryDropdown value={formData.categoryId} onChange={(e) => handleChange(e)} errors={errors} />
                </div>

                {/* Description */}
                <div className="lg:col-span-2 relative">
                  <label className="block text-sm font-semibold mb-1">
                    Description <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <FileTextIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="description"
                      placeholder="Add a description"
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {formData.type === "recurring" && (
                <div className="space-y-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="flex items-center gap-2">
                    <RepeatIcon className="h-5 w-5 text-indigo-500" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recurring Schedule</h3>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Start Date */}
                    <div className="relative">
                      <label className="block text-sm font-semibold mb-1">Start Date *</label>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        When this expense should begin appearing in dashboards
                      </p>
                      <div className="relative">
                        <CalendarIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                          type="datetime-local"
                          name="startDate"
                          value={formData.startDate}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                            errors.startDate ? "border-red-500" : ""
                          }`}
                        />
                      </div>
                      {errors.startDate && <p className="text-xs text-red-500">{errors.startDate}</p>}
                    </div>

                    {/* End Date */}
                    <div className="relative">
                      <label className="block text-sm font-semibold mb-1">
                        End Date <span className="text-gray-400 font-normal">(Optional)</span>
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Leave empty for ongoing expenses</p>
                      <div className="relative">
                        <CalendarIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                          type="datetime-local"
                          name="endDate"
                          value={formData.endDate}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                            errors.endDate ? "border-red-500" : ""
                          }`}
                        />
                      </div>
                      {errors.endDate && <p className="text-xs text-red-500">{errors.endDate}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Receipt - Full width */}
              <div className="relative">
                <label className="block text-sm font-semibold mb-1">
                  Receipt <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <UploadIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-500/20 file:text-indigo-600 dark:file:text-indigo-400 hover:file:bg-indigo-500/30 file:backdrop-blur-sm"
                  />
                </div>
                {formData.receipt && (
                  <p className="text-xs text-green-500 mt-1">New receipt uploaded successfully</p>
                )}
                {formData.existingReceipt && !formData.receipt && (
                  <p className="text-xs text-blue-500 mt-1">Existing receipt will be retained</p>
                )}
              </div>

              {/* Submit */}
              <Button type="submit" disabled={isLoading} className="w-full mt-4">
                {isLoading ? "Processing..." : initialData ? "Update Expense" : "Add Expense"}
              </Button>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default ExpenseForm