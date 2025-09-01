import React, { useState } from 'react';
import Card from '../ui/Card';
import { motion, AnimatePresence } from 'framer-motion';
import { TrashIcon, ArrowUpIcon, ArrowDownIcon, SearchIcon } from 'lucide-react';
import { useIncomeActions } from '../../api/incomes/getJsonIncomes';

const TransactionList = ({
  transactions,
  type
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { handleDeleteIncome } = useIncomeActions();

  const filteredTransactions = transactions.filter(transaction => {
    const searchLower = searchTerm.toLowerCase();
    return transaction.description.toLowerCase().includes(searchLower) || transaction.category?.toLowerCase().includes(searchLower) || transaction.source?.toLowerCase().includes(searchLower) || transaction.amount.toString().includes(searchTerm);
  });
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  const getTypeIcon = (transactionType) => {
    if (transactionType === 'income') {
      return <ArrowUpIcon className="h-5 w-5 text-green-600 dark:text-green-500" />;
    }
    return <ArrowDownIcon className="h-5 w-5 text-red-600 dark:text-red-500" />;
  };

  const handleDelete = async (transactionId, transactionType) => {
    try {
      // The context function handles the API call and state update
      await deleteTransaction(transactionId, transactionType); 
      // The re-render will happen automatically when the context state changes
    } catch (error) {
      console.error("Failed to delete transaction:", error);
    }
  };

  return <Card className="overflow-hidden bg-gray-300 dark:bg-dark-card">
    <div className="py-4 border-b border-gray-200 dark:border-gray-700">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          {type === 'all' ? 'All Transactions' : type === 'income' ? 'Income Transactions' : 'Expense Transactions'}
        </h3>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input type="text" placeholder="Search transactions..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-dark-card dark:text-gray-100" />
        </div>
      </div>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {type === "income" ? "Source" : "Category"}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Description
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className=" divide-y divide-gray-200 dark:divide-gray-700">
          <AnimatePresence>
            {filteredTransactions.length > 0 ? filteredTransactions.map(transaction => <motion.tr key={transaction.id} initial={{
              opacity: 0
            }} animate={{
              opacity: 1
            }} exit={{
              opacity: 0
            }} transition={{
              duration: 0.2
            }} className="hover:bg-gray-50 cursor-pointer dark:hover:bg-dark-border">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className={`p-2 rounded-full ${type === 'income' ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}>
                    {getTypeIcon(type)}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                {formatDate(transaction.date)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                {type === "income" ? transaction.source : transaction.category}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                {transaction.description || '-'}
              </td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${type === 'income' ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
                {type === 'income' ? '+' : '-'}
                {transaction.amount} Ar
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                <button onClick={() => handleDeleteIncome(transaction.id)} className="text-gray-400 hover:text-red-600 dark:hover:text-red-500">
                  <TrashIcon className="h-5 w-5" />
                </button>
              </td>
            </motion.tr>) : <tr>
              <td colSpan={type === 'all' ? 6 : 5} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                No transactions found
              </td>
            </tr>}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  </Card>;
};
export default TransactionList;