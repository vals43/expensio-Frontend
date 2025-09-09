"use client"

import { useState, useEffect } from "react"
import { PlusIcon, CalendarIcon, DollarSignIcon, FileTextIcon, XIcon, UploadIcon, RepeatIcon } from "lucide-react"
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
      setErrors((prev) => ({
        ...prev,
        form: "Failed to save expense. Please try again.",
      }))
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
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative w-full max-w-4xl p-1 my-8"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-h-[90vh] overflow-y-auto rounded-3xl bg-white/20 dark:bg-black/20 backdrop-blur-2xl shadow-2xl border border-white/30 dark:border-white/10"
            >
              <button
                onClick={handleCloseClick}
                className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors z-20 bg-white/20 dark:bg-black/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 dark:hover:bg-black/30"
              >
                <XIcon className="w-5 h-5" />
              </button>

              <div className="relative z-10 p-8">
                <div className="text-center mb-8">
                  <motion.h2
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2"
                  >
                    {initialData ? "Update Expense" : "Add New Expense"}
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-sm text-gray-600 dark:text-gray-400"
                  >
                    Track your spending with style
                  </motion.p>
                </div>

                <motion.form onSubmit={handleSubmit} className="space-y-8">
                  {/* Form Error */}
                  {errors.form && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 backdrop-blur-sm">
                      <p className="text-sm text-red-600 dark:text-red-400 font-medium">{errors.form}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Amount */}
                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">Amount *</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 dark:text-gray-400 group-focus-within:text-blue-500 transition-colors">
                          <DollarSignIcon className="h-5 w-5" />
                        </div>
                        <input
                          type="number"
                          name="amount"
                          placeholder="0.00"
                          value={formData.amount}
                          onChange={handleChange}
                          min="0.01"
                          step="0.01"
                          required
                          className={`block w-full pl-12 pr-4 py-4 rounded-xl text-lg font-medium bg-white/30 dark:bg-black/30 backdrop-blur-xl border border-white/40 dark:border-white/20 focus:border-blue-400/60 focus:ring-4 focus:ring-blue-400/20 placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-white transition-all duration-300 ease-out hover:bg-white/40 dark:hover:bg-black/40 hover:border-white/60 dark:hover:border-white/30 ${
                            errors.amount ? "border-red-400/60 focus:border-red-400/60 focus:ring-red-400/20" : ""
                          }`}
                        />
                      </div>
                      {errors.amount && <p className="text-sm text-red-500 font-medium">{errors.amount}</p>}
                    </div>

                    {/* Type */}
                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">Type</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 dark:text-gray-400 group-focus-within:text-blue-500 transition-colors">
                          <RepeatIcon className="h-5 w-5" />
                        </div>
                        <select
                          name="type"
                          value={formData.type}
                          onChange={handleChange}
                          className="block w-full pl-12 pr-4 py-4 rounded-xl text-base font-medium appearance-none cursor-pointer bg-white/30 dark:bg-black/30 backdrop-blur-xl border border-white/40 dark:border-white/20 focus:border-blue-400/60 focus:ring-4 focus:ring-blue-400/20 text-gray-900 dark:text-white transition-all duration-300 ease-out hover:bg-white/40 dark:hover:bg-black/40 hover:border-white/60 dark:hover:border-white/30"
                        >
                          <option value="one-time">One-time</option>
                          <option value="recurring">Recurring</option>
                        </select>
                      </div>
                    </div>

                    {formData.type === "one-time" && (
                      <div className="space-y-3 lg:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">Date *</label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 dark:text-gray-400 group-focus-within:text-blue-500 transition-colors">
                            <CalendarIcon className="h-5 w-5" />
                          </div>
                          <input
                            type="datetime-local"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                            className={`block w-full pl-12 pr-4 py-4 rounded-xl text-base font-medium bg-white/30 dark:bg-black/30 backdrop-blur-xl border border-white/40 dark:border-white/20 focus:border-blue-400/60 focus:ring-4 focus:ring-blue-400/20 text-gray-900 dark:text-white transition-all duration-300 ease-out hover:bg-white/40 dark:hover:bg-black/40 hover:border-white/60 dark:hover:border-white/30 ${
                              errors.date ? "border-red-400/60 focus:border-red-400/60 focus:ring-red-400/20" : ""
                            }`}
                          />
                        </div>
                        {errors.date && <p className="text-sm text-red-500 font-medium">{errors.date}</p>}
                      </div>
                    )}

                    {/* Category - Full width */}
                    <div className="lg:col-span-2">
                      <CategoryDropdown value={formData.categoryId} onChange={(e) => handleChange(e)} errors={errors} />
                    </div>

                    {/* Description */}
                    <div className="space-y-3 lg:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
                        Description <span className="text-gray-400 font-normal">(Optional)</span>
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 dark:text-gray-400 group-focus-within:text-blue-500 transition-colors">
                          <FileTextIcon className="h-5 w-5" />
                        </div>
                        <input
                          type="text"
                          name="description"
                          placeholder="Add a description"
                          value={formData.description}
                          onChange={handleChange}
                          className="block w-full pl-12 pr-4 py-4 rounded-xl text-base font-medium bg-white/30 dark:bg-black/30 backdrop-blur-xl border border-white/40 dark:border-white/20 focus:border-blue-400/60 focus:ring-4 focus:ring-blue-400/20 placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-white transition-all duration-300 ease-out hover:bg-white/40 dark:hover:bg-black/40 hover:border-white/60 dark:hover:border-white/30"
                        />
                      </div>
                    </div>
                  </div>

                  {formData.type === "recurring" && (
                    <AnimatePresence>
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4 p-6 rounded-2xl bg-white/10 dark:bg-black/10 backdrop-blur-xl border border-white/30 dark:border-white/10"
                      >
                        <div className="flex items-center gap-2 mb-4">
                          <RepeatIcon className="h-5 w-5 text-blue-500" />
                          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Recurring Schedule</h3>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Start Date */}
                          <div className="space-y-3">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
                              Start Date *
                            </label>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              When this expense should begin appearing in dashboards
                            </p>
                            <div className="relative group">
                              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 dark:text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                <CalendarIcon className="h-5 w-5" />
                              </div>
                              <input
                                type="datetime-local"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                className={`block w-full pl-12 pr-4 py-4 rounded-xl text-base font-medium bg-white/30 dark:bg-black/30 backdrop-blur-xl border border-white/40 dark:border-white/20 focus:border-blue-400/60 focus:ring-4 focus:ring-blue-400/20 text-gray-900 dark:text-white transition-all duration-300 ease-out hover:bg-white/40 dark:hover:bg-black/40 hover:border-white/60 dark:hover:border-white/30 ${
                                  errors.startDate
                                    ? "border-red-400/60 focus:border-red-400/60 focus:ring-red-400/20"
                                    : ""
                                }`}
                              />
                            </div>
                            {errors.startDate && <p className="text-sm text-red-500 font-medium">{errors.startDate}</p>}
                          </div>

                          {/* End Date */}
                          <div className="space-y-3">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
                              End Date <span className="text-gray-400 font-normal">(Optional)</span>
                            </label>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Leave empty for ongoing expenses</p>
                            <div className="relative group">
                              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 dark:text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                <CalendarIcon className="h-5 w-5" />
                              </div>
                              <input
                                type="datetime-local"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                className={`block w-full pl-12 pr-4 py-4 rounded-xl text-base font-medium bg-white/30 dark:bg-black/30 backdrop-blur-xl border border-white/40 dark:border-white/20 focus:border-blue-400/60 focus:ring-4 focus:ring-blue-400/20 text-gray-900 dark:text-white transition-all duration-300 ease-out hover:bg-white/40 dark:hover:bg-black/40 hover:border-white/60 dark:hover:border-white/30 ${
                                  errors.endDate
                                    ? "border-red-400/60 focus:border-red-400/60 focus:ring-red-400/20"
                                    : ""
                                }`}
                              />
                            </div>
                            {errors.endDate && <p className="text-sm text-red-500 font-medium">{errors.endDate}</p>}
                          </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  )}

                  {/* Receipt - Full width */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
                      Receipt <span className="text-gray-400 font-normal">(Optional)</span>
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 dark:text-gray-400 group-focus-within:text-blue-500 transition-colors">
                        <UploadIcon className="h-5 w-5" />
                      </div>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleFileChange}
                        className="block w-full pl-12 pr-4 py-4 rounded-xl text-base font-medium bg-white/30 dark:bg-black/30 backdrop-blur-xl border border-white/40 dark:border-white/20 focus:border-blue-400/60 focus:ring-4 focus:ring-blue-400/20 text-gray-900 dark:text-white transition-all duration-300 ease-out hover:bg-white/40 dark:hover:bg-black/40 hover:border-white/60 dark:hover:border-white/30 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500/20 file:text-blue-600 dark:file:text-blue-400 hover:file:bg-blue-500/30 file:backdrop-blur-sm"
                      />
                    </div>
                    {formData.receipt && (
                      <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 backdrop-blur-sm">
                        <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                          New receipt uploaded successfully
                        </p>
                      </div>
                    )}
                    {formData.existingReceipt && !formData.receipt && (
                      <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm">
                        <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                          Existing receipt will be retained
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="pt-6">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-4 px-6 rounded-xl text-base font-semibold bg-gradient-to-r from-blue-500/80 to-purple-600/80 hover:from-blue-600/90 hover:to-purple-700/90 text-white shadow-2xl hover:shadow-blue-500/25 transform hover:scale-[1.02] transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none backdrop-blur-xl border border-white/30 relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="flex items-center justify-center gap-2 relative z-10">
                        {isLoading ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <PlusIcon className="h-5 w-5" />
                        )}
                        {isLoading ? "Processing..." : initialData ? "Update Expense" : "Add Expense"}
                      </div>
                    </button>
                  </div>
                </motion.form>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ExpenseForm

