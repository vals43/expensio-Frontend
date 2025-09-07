import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutGridIcon,
  ListIcon,
  EditIcon,
  TrashIcon,
  ReceiptIcon,
  CalendarIcon,
  FileTextIcon,
  XIcon,
  SearchIcon,
} from "lucide-react";
import Button from "../ui/Button";
import { useExpenses, useExpenseActions } from "../../api/expenses/expenseContext";
import { useReceiptActions } from "../../api/receipt/receiptContext";
import ExpenseForm from "./ExpenseForm";
import { openReceipt } from "../../api/receipt/receiptService";

// UI subcomponents
const Card = ({ children, className }) => (
  <div className={`rounded-lg bg-white dark:bg-dark-card shadow-sm p-4 ${className}`}>{children}</div>
);
const CardContent = ({ children, className }) => <div className={`p-6 pt-0 ${className}`}>{children}</div>;
const CardHeader = ({ children, className }) => <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>{children}</div>;
const CardTitle = ({ children, className }) => <h3 className={`text-xl font-semibold leading-none tracking-tight ${className}`}>{children}</h3>;
const CardAction = ({ children }) => <div className="ml-auto">{children}</div>;

const Table = ({ children }) => (
  <div className="w-full overflow-auto">
    <table className="w-full caption-bottom text-sm">{children}</table>
  </div>
);
const TableBody = ({ children }) => <tbody className="[&_tr:last-child]:border-0">{children}</tbody>;
const TableCell = ({ children, className }) => <td className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className}`}>{children}</td>;
const TableHead = ({ children, className }) => <th className={`h-12 px-4 text-left align-middle font-medium text-muted-foreground ${className}`}>{children}</th>;
const TableHeader = ({ children }) => <thead className="[&_tr]:border-b">{children}</thead>;
const TableRow = ({ children, className }) => (
  <tr className={`border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted ${className}`}>{children}</tr>
);

const ExpenseList = () => {
  const { expenses } = useExpenses();
  const { handleUpdateExpense, handleDeleteExpense } = useExpenseActions();
  const { handleFetchReceipt } = useReceiptActions();

  const [viewMode, setViewMode] = useState("card");
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [isDeleting, setIsDeleting] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");
  const [isFormOpen, setIsFormOpen] = useState(false); // State to control form visibility
  const [selectedExpense, setSelectedExpense] = useState(null); // State to hold the expense being edited

  // Formatters
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  const formatAmount = (amount) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(parseFloat(amount));

  const getCategoryColor = (categoryName) => {
    const colors = {
      Food: "bg-orange-500",
      Transportation: "bg-blue-500",
      Entertainment: "bg-purple-500",
      Healthcare: "bg-green-500",
      Shopping: "bg-pink-500",
      Utilities: "bg-yellow-500",
      Other: "bg-gray-500",
    };
    return colors[categoryName] || colors.Other;
  };

  // === Filters ===
  const uniqueCategories = useMemo(() => {
    const setValues = new Set(expenses.map((t) => t.category?.name).filter(Boolean));
    return Array.from(setValues);
  }, [expenses]);

  const filteredTransactions = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();
    let result = expenses.filter((t) => {
      const matchesSearch =
        t.description?.toLowerCase().includes(searchLower) ||
        t.category?.name?.toLowerCase().includes(searchLower) ||
        t.amount.toString().includes(searchTerm);
      const matchesFilter = filterCategory === "all" || t.category?.name === filterCategory;
      return matchesSearch && matchesFilter;
    });
    result.sort((a, b) =>
      sortOrder === "asc" ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date)
    );
    return result;
  }, [expenses, searchTerm, filterCategory, sortOrder]);

  const total = filteredTransactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const average = filteredTransactions.length ? total / filteredTransactions.length : 0;

  const handleDelete = async (id) => {
    setIsDeleting(id);
    try {
      await handleDeleteExpense(id);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleOpenReceipt = async (expenseId) => {
    try {
      await openReceipt(expenseId, setSelectedReceipt); // Use the updated service function
    } catch (err) {
      console.error(`Failed to fetch receipt for ID ${expenseId}:`, err.message, err.response?.data);
    }
  };

  const handleOpenUpdateForm = (expense) => {
    setSelectedExpense(expense); // Set the expense to edit
    setIsFormOpen(true); // Open the form
  };

  const handleCloseForm = () => {
    setIsFormOpen(false); // Close the form
    setSelectedExpense(null); // Clear the selected expense
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="shadow-xl">
        <div className="bg-primary p-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-primary-foreground tracking-tight">EXPENSES</h2>
            <div className="h-1 w-16 bg-accent mt-2" />
          </div>
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
                className="pl-10 pr-4 py-2 border rounded-md w-48 dark:bg-dark-card dark:text-gray-100"
              />
            </div>

            {/* Filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border rounded-md dark:bg-dark-card dark:text-gray-100"
            >
              <option value="all">All Categories</option>
              {uniqueCategories.map((c, i) => (
                <option key={i} value={c}>{c}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-3 py-2 rounded-md dark:bg-dark-card dark:text-gray-100"
            >
              <option value="desc">Newest first</option>
              <option value="asc">Oldest first</option>
            </select>

            {/* Toggle View */}
            <div className="flex items-center gap-2 bg-primary-foreground/10 p-1 rounded">
              <Button variant={viewMode === "card" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("card")}>
                <LayoutGridIcon className="h-4 w-4 mr-1" /> Cards
              </Button>
              <Button variant={viewMode === "list" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("list")}>
                <ListIcon className="h-4 w-4 mr-1" /> List
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="p-6 border-b-2 border-border grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{filteredTransactions.length}</div>
            <div className="text-sm text-muted-foreground uppercase tracking-wide">TOTAL</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{formatAmount(total)}</div>
            <div className="text-sm text-muted-foreground uppercase tracking-wide">AMOUNT</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{formatAmount(average)}</div>
            <div className="text-sm text-muted-foreground uppercase tracking-wide">AVERAGE</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {viewMode === "card" ? (
          <motion.div
            key="card-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredTransactions.map((t) => (
              <motion.div key={t.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="hover:shadow-2xl shadow-xl border-l-4 border-b-4 border-gray-200 dark:border-gray-700 transition-all duration-300 hover:scale-[1.02] rounded-xl">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className={'text-red-600'}>-{formatAmount(t.amount)}</CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                          <div className={`w-3 h-3 rounded-full ${getCategoryColor(t.category?.name || "Other")}`} />
                          <span>{t.category?.name || "Other"}</span>
                        </div>
                      </div>
                      <CardAction>
                        <div className="flex items-center gap-1">
                          {t.receipt && (
                            <Button variant="ghost" size="sm" onClick={() => handleOpenReceipt(t.id)}>
                              <ReceiptIcon className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" onClick={() => handleOpenUpdateForm(t)}>
                            <EditIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(t.id)}
                            disabled={isDeleting === t.id}
                            className="hover:bg-red-600 hover:text-white rounded-3xl transition-all duration-100"
                          >
                            {isDeleting === t.id ? (
                              <div className="w-4 h-4 border-2 border-current border-t-transparent animate-spin rounded-full" />
                            ) : (
                              <TrashIcon className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </CardAction>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm">
                      <CalendarIcon className="h-4 w-4" />
                      <span>{formatDate(t.date)}</span>
                    </div>
                    {t.description && (
                      <div className="flex items-start gap-2 text-sm mt-2">
                        <FileTextIcon className="h-4 w-4 mt-0.5" />
                        <span>{t.description}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="list-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-card rounded-2xl border-border shadow-2xl dark:bg-dark-card"
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>AMOUNT</TableHead>
                  <TableHead>CATEGORY</TableHead>
                  <TableHead>DATE</TableHead>
                  <TableHead>DESCRIPTION</TableHead>
                  <TableHead className="text-right">ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((t) => (
                  <motion.tr key={t.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-muted/30">
                    <TableCell className="text-red-600">{formatAmount(t.amount)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getCategoryColor(t.category?.name || "Other")}`} />
                        <span>{t.category?.name || "Other"}</span>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(t.date)}</TableCell>
                    <TableCell>{t.description || "—"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {t.receipt && (
                          <Button variant="ghost" size="sm" onClick={() => handleOpenReceipt(t.id)}>
                            <ReceiptIcon className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => handleOpenUpdateForm(t)}>
                          <EditIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => handleDelete(t.id)} disabled={isDeleting === t.id}>
                          {isDeleting === t.id ? (
                            <div className="w-4 h-4 border-2 border-current border-t-transparent animate-spin rounded-full" />
                          ) : (
                            <TrashIcon className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Receipt Modal */}
      <AnimatePresence>
        {selectedReceipt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedReceipt(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card border-2 border-border shadow-2xl max-w-2xl w-full overflow-hidden dark:bg-dark-card"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-primary p-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-primary-foreground tracking-tight">RECEIPT VIEW</h3>
                <Button variant="ghost" size="sm" onClick={() => setSelectedReceipt(null)}>
                  <XIcon className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-6 flex items-center justify-center">
                {selectedReceipt?.url ? (
                  selectedReceipt.type === "application/pdf" ? (
                    <iframe
                      src={selectedReceipt.url}
                      className="w-full h-[80vh]"
                      title="Receipt PDF"
                    />
                  ) : (
                    <img
                      src={selectedReceipt.url}
                      alt="Receipt"
                      className="max-h-[80vh] object-contain"
                    />
                  )
                ) : (
                  <p className="text-muted-foreground">No receipt available</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expense Form */}
      <AnimatePresence>
        {isFormOpen && (
          <ExpenseForm
            initialData={selectedExpense}
            onClose={handleCloseForm}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExpenseList;