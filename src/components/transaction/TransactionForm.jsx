"use client"

import { useState, useEffect } from "react"
import Button from "../ui/Button"
import { PlusIcon, CalendarIcon, TagIcon, DollarSignIcon, FileTextIcon, XIcon } from "lucide-react"
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
            // Réinitialise le formulaire pour la création
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

            // Appel de la fonction onSubmit du parent
            if (onSubmit) {
                await onSubmit(transactionData);
            }

            // Ferme le modal après la soumission réussie
            if (onClose) {
                onClose();
            }
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
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                onClick={(e) => e.target === e.currentTarget && onClose?.()}
            />

            <motion.div
                key="modal"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="fixed inset-0 flex items-center justify-center z-50 p-3 sm:p-4 md:p-6"
            >
                <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-3xl bg-white dark:bg-gray-900 shadow-2xl rounded-2xl sm:rounded-3xl overflow-hidden max-h-[95vh] sm:max-h-[90vh] border border-gray-200 dark:border-gray-700">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-20 p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <XIcon className="w-5 h-5" />
                    </button>

                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 opacity-80" />

                    <div className="absolute inset-0 overflow-hidden opacity-20 dark:opacity-10">
                        <div className="absolute -top-10 -left-10 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full blur-2xl animate-pulse" />
                        <div
                            className="absolute -bottom-10 -right-10 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-2xl animate-pulse"
                            style={{ animationDelay: "1s" }}
                        />
                    </div>

                    <div className="relative z-10 p-4 sm:p-6 md:p-8 overflow-y-auto max-h-[95vh] sm:max-h-[90vh]">
                        <div className="text-center mb-6 sm:mb-8">
                            <motion.h2
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2"
                            >
                                {initialData ? "Update Income" : "Add New Income"}
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="text-sm sm:text-base text-gray-600 dark:text-gray-400"
                            >
                                Track your financial progress
                            </motion.p>
                        </div>

                        <motion.form
                            onSubmit={handleSubmit}
                            className="space-y-4 sm:space-y-6"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            {submissionError && (
                                <div className="p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                    <p className="text-sm text-red-600 dark:text-red-400 font-medium text-center">{submissionError}</p>
                                </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                {/* Amount Field */}
                                <div className="sm:col-span-2 md:col-span-1">
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                                        Amount *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none text-gray-500 dark:text-gray-400">
                                            <DollarSignIcon className="h-4 w-4 sm:h-5 sm:w-5" />
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
                                            className={`block w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 rounded-lg sm:rounded-xl text-base sm:text-lg font-medium bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20 placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-white transition-all duration-200 ${errors.amount ? "border-red-400 focus:border-red-400 focus:ring-red-500/20" : ""}`}
                                        />
                                    </div>
                                    {errors.amount && <p className="text-sm text-red-500 font-medium mt-1">{errors.amount}</p>}
                                </div>

                                {/* Source Field */}
                                <div className="sm:col-span-2 md:col-span-1">
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                                        Source *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none text-gray-500 dark:text-gray-400">
                                            <TagIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                                        </div>
                                        <select
                                            name="source"
                                            value={formData.source}
                                            onChange={handleChange}
                                            required
                                            className={`block w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 rounded-lg sm:rounded-xl text-base font-medium appearance-none cursor-pointer bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20 text-gray-900 dark:text-white transition-all duration-200 ${errors.source ? "border-red-400 focus:border-red-400 focus:ring-red-500/20" : ""}`}
                                        >
                                            <option value="">Select a source</option>
                                            {incomeCategories.map((category) => (
                                                <option key={category} value={category} className="bg-white dark:bg-gray-800">
                                                    {category}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {errors.source && <p className="text-sm text-red-500 font-medium mt-1">{errors.source}</p>}
                                </div>

                                {/* Date Field */}
                                <div className="sm:col-span-2 md:col-span-1">
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Date *</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none text-gray-500 dark:text-gray-400">
                                            <CalendarIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                                        </div>
                                        <input
                                            type="date"
                                            name="date"
                                            value={formData.date}
                                            onChange={handleChange}
                                            required
                                            className={`block w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 rounded-lg sm:rounded-xl text-base font-medium bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20 text-gray-900 dark:text-white transition-all duration-200 ${errors.date ? "border-red-400 focus:border-red-400 focus:ring-red-500/20" : ""}`}
                                        />
                                    </div>
                                    {errors.date && <p className="text-sm text-red-500 font-medium mt-1">{errors.date}</p>}
                                </div>
                            </div>

                            {/* Description Field */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                                    Description <span className="text-gray-400 font-normal">(Optional)</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none text-gray-500 dark:text-gray-400">
                                        <FileTextIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                                    </div>
                                    <input
                                        type="text"
                                        name="description"
                                        placeholder="Add a description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="block w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 rounded-lg sm:rounded-xl text-base font-medium bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20 placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-white transition-all duration-200"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 sm:pt-6">
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-3 sm:py-4 px-6 rounded-lg sm:rounded-xl text-base sm:text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        {isLoading ? (
                                            <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <PlusIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                                        )}
                                        {isLoading ? "Processing..." : initialData ? "Update Income" : "Add Income"}
                                    </div>
                                </Button>
                            </div>
                        </motion.form>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}

export default TransactionForm