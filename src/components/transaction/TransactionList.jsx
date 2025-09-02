import React, { useState, useMemo } from 'react';
import Card from '../ui/Card';
import { motion, AnimatePresence } from 'framer-motion';
import { TrashIcon, ArrowUpIcon, ArrowDownIcon, SearchIcon, PencilIcon } from 'lucide-react';
import { useIncomes, useIncomeActions } from '../../api/incomes/getJsonIncomes';
import { ConfirmDeleteModal } from '../ui/ConfirmDeleteModal';
import TransactionForm from './TransactionForm';

const TransactionList = ({ type }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterCategory, setFilterCategory] = useState('all');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [editTransaction, setEditTransaction] = useState(null);

  const { incomes } = useIncomes();
  const { handleDeleteIncome } = useIncomeActions();
  const transactions = incomes || [];

  const formatDate = (dateString) =>
    new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(dateString));

  const getTypeIcon = (transactionType) =>
    transactionType === 'income' ? (
      <ArrowUpIcon className="h-5 w-5 text-green-600 dark:text-green-500" />
    ) : (
      <ArrowDownIcon className="h-5 w-5 text-red-600 dark:text-red-500" />
    );

  const uniqueFilters = useMemo(() => {
    const setValues = new Set(transactions.map(t => (type === 'income' ? t.source : t.category)).filter(Boolean));
    return Array.from(setValues);
  }, [transactions, type]);

  const filteredTransactions = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();
    let result = transactions.filter(t => {
      const matchesSearch =
        t.description?.toLowerCase().includes(searchLower) ||
        t.category?.toLowerCase().includes(searchLower) ||
        t.source?.toLowerCase().includes(searchLower) ||
        t.amount.toString().includes(searchTerm);

      const matchesFilter =
        filterCategory === 'all' || (type === 'income' ? t.source === filterCategory : t.category === filterCategory);

      return matchesSearch && matchesFilter;
    });

    result.sort((a, b) =>
      sortOrder === 'asc' ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date)
    );
    return result;
  }, [transactions, searchTerm, filterCategory, sortOrder, type]);

  const handleDeleteClick = (transaction) => {
    setSelectedTransaction(transaction);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedTransaction) {
      await handleDeleteIncome(selectedTransaction.id);
      setDeleteModalOpen(false);
      setSelectedTransaction(null);
    }
  };

  const handleEditClick = (transaction) => {
    setEditTransaction(transaction);
  };

  return (
    <>
      <Card className="overflow-hidden bg-gray-300 dark:bg-dark-card">
        {/* Header */}
        <div className="py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {type === 'all' ? 'All Transactions' : type === 'income' ? 'Income Transactions' : 'Expense Transactions'}
            </h3>
            <div className="flex flex-wrap gap-3 items-center">
              {/* Search */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md w-48 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-dark-card dark:text-gray-100"
                />
              </div>

              {/* Filter */}
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-dark-card dark:text-gray-100"
              >
                <option value="all">All {type === 'income' ? 'Sources' : 'Categories'}</option>
                {uniqueFilters.map((f, idx) => (
                  <option key={idx} value={f}>
                    {f}
                  </option>
                ))}
              </select>

              {/* Sort */}
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-dark-card dark:text-gray-100"
              >
                <option value="desc">Newest first</option>
                <option value="asc">Oldest first</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              <AnimatePresence>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((t) => (
                    <motion.tr
                      key={t.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="hover:bg-gray-50 cursor-pointer dark:hover:bg-dark-border"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div
                            className={`p-2 rounded-full ${
                              type === 'income' ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'
                            }`}
                          >
                            {getTypeIcon(type)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{formatDate(t.date)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {type === 'income' ? t.source : t.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{t.description || '-'}</td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${
                          type === 'income' ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'
                        }`}
                      >
                        {type === 'income' ? '+' : '-'}
                        {t.amount} Ar
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm flex items-center justify-end gap-3">
                        <button
                          onClick={() => handleEditClick(t)}
                          className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-500"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(t)}
                          className="text-gray-400 hover:text-red-600 dark:hover:text-red-500"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                      No transactions found
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal de confirmation */}
      {selectedTransaction && (
        <ConfirmDeleteModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          itemName={selectedTransaction.source || selectedTransaction.category}
          onConfirm={handleConfirmDelete}
        />
      )}

      {/* Modal d'édition */}
      {editTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-dark-card rounded-lg shadow-lg p-6 w-full max-w-md"
          >
            <TransactionForm
              initialData={editTransaction}
              onSubmit={() => {
                setEditTransaction(null);
              }}
            />
            <div className="mt-4 text-right">
              <button
                onClick={() => setEditTransaction(null)}
                className="text-sm text-gray-500 dark:text-gray-300 hover:underline"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default TransactionList;
