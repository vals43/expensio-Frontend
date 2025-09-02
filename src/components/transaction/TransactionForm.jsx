import { useState, useEffect } from "react"
import Button from "../ui/Button"
import { PlusIcon, CalendarIcon, TagIcon, DollarSignIcon, FileTextIcon, X as XIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useIncomeActions } from "../../api/incomes/getJsonIncomes"

const TransactionForm = ({ onSubmit, initialData = null, onClose }) => {
  const { handleCreateIncome, handleUpdateIncome } = useIncomeActions()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    amount: "",
    source: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  })
  const [errors, setErrors] = useState({})
  const [isVisible, setIsVisible] = useState(true) // pour l'animation de fermeture

  useEffect(() => {
    if (initialData) {
      setFormData({
        amount: initialData.amount,
        source: initialData.source,
        description: initialData.description,
        date: initialData.date.split("T")[0],
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
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsLoading(true)

    try {
      const transactionData = { ...formData, amount: Number(formData.amount) }
      if (initialData) {
        await handleUpdateIncome(initialData.id, transactionData)
      } else {
        await handleCreateIncome(transactionData)
      }

      if (onSubmit) await onSubmit(transactionData)

      // Fermer le formulaire après soumission
      setIsVisible(false)
      setTimeout(() => {
        if (onClose) onClose()
      }, 400)

    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsLoading(false)
      if (!initialData) {
        setFormData({
          amount: "",
          source: "",
          description: "",
          date: new Date().toISOString().split("T")[0],
        })
      }
    }
  }

  const incomeCategories = ["Salary", "Freelance", "Investments", "Gift", "Other"]

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
            {/* Bouton X */}
            <button
              onClick={handleCloseClick}
              className="absolute top-3 right-3 text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors z-20"
            >
              <XIcon className="w-6 h-6" />
            </button>

            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent dark:from-white/5 pointer-events-none" />
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob dark:bg-purple-900/30" />
              <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000 dark:bg-yellow-900/30" />
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
                  {initialData ? "Update Income" : "Add New Income"}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-sm text-gray-600 dark:text-gray-400"
                >
                  Track your financial progress
                </motion.p>
              </div>

              <motion.form onSubmit={handleSubmit} className="space-y-6">
                {/* Amount */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Amount</label>
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

                {/* Source */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Source</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 dark:text-gray-400 group-focus-within:text-primary transition-colors">
                      <TagIcon className="h-5 w-5" />
                    </div>
                    <select
                      name="source"
                      value={formData.source}
                      onChange={handleChange}
                      required
                      className={`block w-full pl-12 pr-4 py-4 rounded-xl text-base font-medium appearance-none cursor-pointer bg-white/50 dark:bg-black/20 backdrop-blur-sm border border-white/30 dark:border-white/10 focus:border-primary/50 focus:ring-4 focus:ring-primary/20 text-gray-900 dark:text-white transition-all duration-200 ease-out hover:bg-white/60 dark:hover:bg-black/30 ${errors.source ? "border-red-400 focus:border-red-400 focus:ring-red-200" : ""}`}
                    >
                      <option value="">Select a source</option>
                      {incomeCategories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.source && <p className="text-sm text-red-500 font-medium">{errors.source}</p>}
                </div>

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

                {/* Date */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Date</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 dark:text-gray-400">
                      <CalendarIcon className="h-5 w-5" />
                    </div>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                      className={`block w-full pl-12 pr-4 py-4 rounded-xl text-base font-medium bg-white/50 dark:bg-black/20 backdrop-blur-sm border border-white/30 dark:border-white/10 focus:border-primary/50 focus:ring-4 focus:ring-primary/20 text-gray-900 dark:text-white transition-all duration-200 ease-out hover:bg-white/60 dark:hover:bg-black/30 ${errors.date ? "border-red-400 focus:border-red-400 focus:ring-red-200" : ""}`}
                    />
                  </div>
                  {errors.date && <p className="text-sm text-red-500 font-medium">{errors.date}</p>}
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 px-6 rounded-xl text-base font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 ease-out disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none backdrop-blur-sm border border-white/20"
                  >
                    <div className="flex items-center justify-center gap-2">
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <PlusIcon className="h-5 w-5" />
                      )}
                      {isLoading ? "Processing..." : initialData ? "Update Income" : "Add Income"}
                    </div>
                  </Button>
                </div>
              </motion.form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default TransactionForm
