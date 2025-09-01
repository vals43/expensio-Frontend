import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { PlusIcon, CalendarIcon, TagIcon, DollarSignIcon, FileTextIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useIncomeActions } from '../../api/incomes/getJsonIncomes';

const TransactionForm = ({
  onSuccess,
  initialData = null
}) => {
  const { handleCreateIncome, handleUpdateIncome } = useIncomeActions(); // Correct usage of the hook
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    source: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        amount: initialData.amount,
        source: initialData.source,
        description: initialData.description,
        date: initialData.date.split('T')[0]
      });
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.amount || isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }
    if (!formData.source) {
      newErrors.source = 'Please select a source';
    }
    if (!formData.date) {
      newErrors.date = 'Please select a date';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const transactionData = {
        amount: Number(formData.amount),
        source: formData.source,
        description: formData.description,
        date: formData.date
      };
      let result;
      if (initialData) {
        // Use the hook's update function
        result = await handleUpdateIncome(initialData.id, transactionData);
      } else {
        // Use the hook's create function
        result = await handleCreateIncome(transactionData);
      }
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (error) {
      console.error("Error submitting income form:", error);
    } finally {
      setIsLoading(false);
      if (!initialData) {
        setFormData({
          amount: '',
          source: '',
          description: '',
          date: new Date().toISOString().split('T')[0]
        });
      }
    }
  };

  const incomeCategories = ['Salary', 'Freelance', 'Investments', 'Gift', 'Other'];

  return <motion.form onSubmit={handleSubmit} initial={{
    opacity: 0
  }} animate={{
    opacity: 1
  }} transition={{
    duration: 0.3
  }} className="space-y-4">
    <div>
      <Input type="number" name="amount" label="Amount" placeholder="0.00" value={formData.amount} onChange={handleChange} error={errors.amount} icon={<DollarSignIcon className="h-5 w-5" />} min="0.01" step="0.01" required />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Source
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 dark:text-gray-400">
          <TagIcon className="h-5 w-5" />
        </div>
        <select name="source" value={formData.source} onChange={handleChange} className={`
              block w-full pl-10 rounded-md shadow-sm border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 dark:bg-gray-700 dark:text-gray-100
              ${errors.source ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
            `} required>
          <option value="">Select a source</option>
          {incomeCategories.map(category => <option key={category} value={category}>
            {category}
          </option>)}
        </select>
      </div>
      {errors.source && <p className="mt-1 text-sm text-red-600 dark:text-red-500">
        {errors.source}
      </p>}
    </div>
    <div>
      <Input type="text" name="description" label="Description (Optional)" placeholder="Add a description" value={formData.description} onChange={handleChange} icon={<FileTextIcon className="h-5 w-5" />} />
    </div>
    <div>
      <Input type="date" name="date" label="Date" value={formData.date} onChange={handleChange} error={errors.date} icon={<CalendarIcon className="h-5 w-5" />} required />
    </div>
    <Button type="submit" fullWidth isLoading={isLoading} icon={<PlusIcon className="h-5 w-5" />}>
      {initialData ? 'Update Income' : 'Add Income'}
    </Button>
  </motion.form>;
};
export default TransactionForm;