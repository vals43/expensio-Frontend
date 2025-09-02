
import { useState, useEffect } from "react"
import {
  PlusIcon,
  CalendarIcon,
  TagIcon,
  DollarSignIcon,
  FileTextIcon,
  XIcon,
  UploadIcon,
  RepeatIcon,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useExpenseActions } from "../../api/expenses/expenseContext" // ⬅️ Importez le hook ici
import CategoryDropdown from "../category/categoryDropdown"

const ExpenseForm = ({ initialData = null, onClose }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    amount: "",
    date: new Date().toISOString().slice(0, 16),
    categoryId: "",
    description: "",
    type: "one-time",
    startDate: "",
    endDate: "",
    receipt: null,
  })
  const [errors, setErrors] = useState({})
  const [isVisible, setIsVisible] = useState(true)

  // ⬅️ Utilisez le hook pour accéder aux actions
  const { handleCreateExpense, handleUpdateExpense } = useExpenseActions()

  useEffect(() => {
    if (initialData) {
      setFormData({
        amount: initialData.amount || "",
        date: initialData.date ? new Date(initialData.date).toISOString().slice(0, 16) : "",
        categoryId: initialData.categoryId || "",
        description: initialData.description || "",
        type: initialData.type || "one-time",
        startDate: initialData.startDate ? new Date(initialData.startDate).toISOString().slice(0, 16) : "",
        endDate: initialData.endDate ? new Date(initialData.endDate).toISOString().slice(0, 16) : "",
        receipt: initialData.receipt || null,
      })
    }
  }, [initialData])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.amount || isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = "Please enter a valid amount"
    }

    if (!formData.date) {
      newErrors.date = "Please select a date"
    }

    if (!formData.categoryId) {
      newErrors.categoryId = "Please select a category"
    }

    if (formData.type === "recurring") {
      if (!formData.startDate) {
        newErrors.startDate = "Start date is required for recurring expenses"
      }
      if (!formData.endDate) {
        newErrors.endDate = "End date is required for recurring expenses"
      }
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
        ...formData,
        amount: Number(formData.amount),
        date: new Date(formData.date).toISOString(),
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : undefined,
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined,
      }

      // ⬅️ Remplacez l'appel de onSubmit par les actions du contexte
      if (initialData) {
        await handleUpdateExpense(initialData.id, expenseData)
      } else {
        await handleCreateExpense(expenseData)
      }

      setIsVisible(false)
      setTimeout(() => {
        if (onClose) onClose()
      }, 400)
    } catch (error) {
      console.error("Error submitting expense:", error)
    } finally {
      setIsLoading(false)
      if (!initialData) {
        setFormData({
          amount: "",
          date: new Date().toISOString().slice(0, 16),
          categoryId: "",
          description: "",
          type: "one-time",
          startDate: "",
          endDate: "",
          receipt: null,
        })
      }
    }
  }


  const handleCloseClick = () => {
    setIsVisible(false)
    setTimeout(() => {
      if (onClose) onClose()
    }, 400)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-md mx-auto p-1"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative overflow-hidden rounded-2xl bg-white/10 dark:bg-black/10 backdrop-blur-xl shadow-2xl"
          >
            <button
              onClick={handleCloseClick}
              className="absolute top-3 right-3 text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors z-20"
            >
              <XIcon className="w-6 h-6" />
            </button>

            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent dark:from-white/5 pointer-events-none" />
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-0 -left-4 w-72 h-72 bg-red-300 rounded-full mix-blend-multiply filter blur-xl animate-blob dark:bg-red-900/30" />
              <div className="absolute top-0 -right-4 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000 dark:bg-orange-900/30" />
              <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000 dark:bg-pink-900/30" />
            </div>

            <div className="relative z-10 p-8">
              <div className="text-center mb-8">
                <motion.h2
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2"
                >
                  {initialData ? "Update Expense" : "Add New Expense"}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-sm text-gray-600 dark:text-gray-400"
                >
                  Track your spending
                </motion.p>
              </div>

              <motion.form onSubmit={handleSubmit} className="space-y-6">
                {/* Amount */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Amount *</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 dark:text-gray-400 group-focus-within:text-primary transition-colors">
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
                      className={`block w-full pl-12 pr-4 py-4 rounded-xl text-lg font-medium bg-white/50 dark:bg-black/20 backdrop-blur-sm border border-white/30 dark:border-white/10 focus:border-primary/50 focus:ring-4 focus:ring-primary/20 placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-white transition-all duration-200 ease-out hover:bg-white/60 dark:hover:bg-black/30 ${errors.amount ? "border-red-400 focus:border-red-400 focus:ring-red-200" : ""}`}
                    />
                  </div>
                  {errors.amount && <p className="text-sm text-red-500 font-medium">{errors.amount}</p>}
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Date *</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 dark:text-gray-400">
                      <CalendarIcon className="h-5 w-5" />
                    </div>
                    <input
                      type="datetime-local"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                      className={`block w-full pl-12 pr-4 py-4 rounded-xl text-base font-medium bg-white/50 dark:bg-black/20 backdrop-blur-sm border border-white/30 dark:border-white/10 focus:border-primary/50 focus:ring-4 focus:ring-primary/20 text-gray-900 dark:text-white transition-all duration-200 ease-out hover:bg-white/60 dark:hover:bg-black/30 ${errors.date ? "border-red-400 focus:border-red-400 focus:ring-red-200" : ""}`}
                    />
                  </div>
                  {errors.date && <p className="text-sm text-red-500 font-medium">{errors.date}</p>}
                </div>

                {/* Category */}
                {/* Category */}
                <CategoryDropdown
                  value={formData.categoryId}
                  onChange={(e) => handleChange(e)}
                  errors={errors}
                />


                {/* Type */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Type</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 dark:text-gray-400 group-focus-within:text-primary transition-colors">
                      <RepeatIcon className="h-5 w-5" />
                    </div>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="block w-full pl-12 pr-4 py-4 rounded-xl text-base font-medium appearance-none cursor-pointer bg-white/50 dark:bg-black/20 backdrop-blur-sm border border-white/30 dark:border-white/10 focus:border-primary/50 focus:ring-4 focus:ring-primary/20 text-gray-900 dark:text-white transition-all duration-200 ease-out hover:bg-white/60 dark:hover:bg-black/30"
                    >
                      <option value="one-time">One-time</option>
                      <option value="recurring">Recurring</option>
                    </select>
                  </div>
                </div>

                {formData.type === "recurring" && (
                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-6"
                    >
                      {/* Start Date */}
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                          Start Date *
                        </label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 dark:text-gray-400">
                            <CalendarIcon className="h-5 w-5" />
                          </div>
                          <input
                            type="datetime-local"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            className={`block w-full pl-12 pr-4 py-4 rounded-xl text-base font-medium bg-white/50 dark:bg-black/20 backdrop-blur-sm border border-white/30 dark:border-white/10 focus:border-primary/50 focus:ring-4 focus:ring-primary/20 text-gray-900 dark:text-white transition-all duration-200 ease-out hover:bg-white/60 dark:hover:bg-black/30 ${errors.startDate ? "border-red-400 focus:border-red-400 focus:ring-red-200" : ""}`}
                          />
                        </div>
                        {errors.startDate && <p className="text-sm text-red-500 font-medium">{errors.startDate}</p>}
                      </div>

                      {/* End Date */}
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                          End Date *
                        </label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 dark:text-gray-400">
                            <CalendarIcon className="h-5 w-5" />
                          </div>
                          <input
                            type="datetime-local"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleChange}
                            className={`block w-full pl-12 pr-4 py-4 rounded-xl text-base font-medium bg-white/50 dark:bg-black/20 backdrop-blur-sm border border-white/30 dark:border-white/10 focus:border-primary/50 focus:ring-4 focus:ring-primary/20 text-gray-900 dark:text-white transition-all duration-200 ease-out hover:bg-white/60 dark:hover:bg-black/30 ${errors.endDate ? "border-red-400 focus:border-red-400 focus:ring-red-200" : ""}`}
                          />
                        </div>
                        {errors.endDate && <p className="text-sm text-red-500 font-medium">{errors.endDate}</p>}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                )}

                {/* Description */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                    Description <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 dark:text-gray-400">
                      <FileTextIcon className="h-5 w-5" />
                    </div>
                    <input
                      type="text"
                      name="description"
                      placeholder="Add a description"
                      value={formData.description}
                      onChange={handleChange}
                      className="block w-full pl-12 pr-4 py-4 rounded-xl text-base font-medium bg-white/50 dark:bg-black/20 backdrop-blur-sm border border-white/30 dark:border-white/10 focus:border-primary/50 focus:ring-4 focus:ring-primary/20 placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-white transition-all duration-200 ease-out hover:bg-white/60 dark:hover:bg-black/30"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                    Receipt <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 dark:text-gray-400">
                      <UploadIcon className="h-5 w-5" />
                    </div>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                      className="block w-full pl-12 pr-4 py-4 rounded-xl text-base font-medium bg-white/50 dark:bg-black/20 backdrop-blur-sm border border-white/30 dark:border-white/10 focus:border-primary/50 focus:ring-4 focus:ring-primary/20 text-gray-900 dark:text-white transition-all duration-200 ease-out hover:bg-white/60 dark:hover:bg-black/30 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                    />
                  </div>
                  {formData.receipt && (
                    <p className="text-sm text-green-600 dark:text-green-400">Receipt uploaded successfully</p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 px-6 rounded-xl text-base font-semibold bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 ease-out disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none backdrop-blur-sm border border-white/20"
                  >
                    <div className="flex items-center justify-center gap-2">
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
      )}
    </AnimatePresence>
  )
}

export default ExpenseForm