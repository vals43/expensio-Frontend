import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutGridIcon,
  ListIcon,
  EditIcon,
  TrashIcon,
  CalendarIcon,
  FileTextIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  SearchIcon,
} from "lucide-react";
import Button from "../ui/Button";
// Importation du hook du contexte
import { useIncomes, useIncomeActions } from "../../api/incomes/getJsonIncomes";
// Le formulaire n'est plus nécessaire ici
// import TransactionForm from "./TransactionForm"; 

// === UI Subcomponents ===
const Card = ({ children, className }) => (
  <div className={`rounded-lg bg-white dark:bg-dark-card shadow-sm p-4 ${className}`}>{children}</div>
);
const CardContent = ({ children, className }) => <div className={`p-6 pt-0 ${className}`}>{children}</div>;
const CardHeader = ({ children, className }) => <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>{children}</div>;
const CardTitle = ({ children, className }) => <h3 className={`text-xl font-semibold tracking-tight ${className}`}>{children}</h3>;
const CardAction = ({ children }) => <div className="ml-auto">{children}</div>;

const Table = ({ children }) => (
  <div className="w-full overflow-auto">
    <table className="w-full caption-bottom text-sm">{children}</table>
  </div>
);
const TableBody = ({ children }) => <tbody>{children}</tbody>;
const TableCell = ({ children, className }) => <td className={`p-4 align-middle ${className}`}>{children}</td>;
const TableHead = ({ children, className }) => <th className={`h-12 px-4 text-left font-medium text-muted-foreground ${className}`}>{children}</th>;
const TableHeader = ({ children }) => <thead className="[&_tr]:border-b">{children}</thead>;
const TableRow = ({ children, className }) => (
  <tr className={`border-b transition-colors hover:bg-muted/50 ${className}`}>{children}</tr>
);

// Ajout de la prop 'onEdit' pour la gestion de l'édition par le parent
const TransactionList = ({ type, onEdit }) => {
  const { incomes } = useIncomes();
  const { handleDeleteIncome } = useIncomeActions();
  const transactions = incomes || [];

  const [viewMode, setViewMode] = useState("card");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");
  // Ces états ne sont plus nécessaires, la logique est dans le parent
  // const [isFormOpen, setIsFormOpen] = useState(false);
  // const [editTransaction, setEditTransaction] = useState(null);
  const [isDeleting, setIsDeleting] = useState(null);

  // Formatters
  const formatDate = (dateString) =>
    new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric" }).format(new Date(dateString));
  const formatAmount = (amount) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(parseFloat(amount));

  const getTypeColor = (transactionType) =>
    transactionType === "income" ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500";
  const getTypeIcon = (transactionType) =>
    transactionType === "income" ? <ArrowUpIcon className="h-5 w-5" /> : <ArrowDownIcon className="h-5 w-5" />;

  // Filters
  const uniqueFilters = useMemo(() => {
    const setValues = new Set(transactions.map((t) => (type === "income" ? t.source : t.category)).filter(Boolean));
    return Array.from(setValues);
  }, [transactions, type]);

  const filteredTransactions = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();
    let result = transactions.filter((t) => {
      const matchesSearch =
        t.description?.toLowerCase().includes(searchLower) ||
        t.category?.toLowerCase().includes(searchLower) ||
        t.source?.toLowerCase().includes(searchLower) ||
        t.amount.toString().includes(searchTerm);

      const matchesFilter =
        filterCategory === "all" ||
        (type === "income" ? t.source === filterCategory : t.category === filterCategory);

      return matchesSearch && matchesFilter;
    });

    result.sort((a, b) =>
      sortOrder === "asc" ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date)
    );
    return result;
  }, [transactions, searchTerm, filterCategory, sortOrder, type]);

  const total = filteredTransactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const average = filteredTransactions.length ? total / filteredTransactions.length : 0;

  const handleDelete = async (id) => {
    setIsDeleting(id);
    try {
      await handleDeleteIncome(id);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(null);
    }
  };

  // La fonction pour l'édition appelle simplement la prop `onEdit` passée par le parent
  const handleEdit = (transaction) => {
    if (onEdit) {
      onEdit(transaction);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="shadow-xl">
        <div className="bg-primary p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-primary-foreground tracking-tight">
              {type === "income" ? "INCOMES" : type === "expense" ? "EXPENSES" : "TRANSACTIONS"}
            </h2>
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
              <option value="all">All {type === "income" ? "Sources" : "Categories"}</option>
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
            <div className="text-sm text-muted-foreground uppercase">TOTAL</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${getTypeColor(type)}`}>{formatAmount(total)}</div>
            <div className="text-sm text-muted-foreground uppercase">AMOUNT</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{formatAmount(average)}</div>
            <div className="text-sm text-muted-foreground uppercase">AVERAGE</div>
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
                <Card className="hover:shadow-2xl border-l-4 border-b-4 border-gray-200 dark:border-gray-700 transition-all duration-300 hover:scale-[1.02] rounded-xl">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className={getTypeColor(type)}>
                          {type === "income" ? "+" : "-"} {formatAmount(t.amount)}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                          {getTypeIcon(type)}
                          <span>{type === "income" ? t.source : t.category}</span>
                        </div>
                      </div>
                      <CardAction>
                        <div className="flex items-center gap-1">
                          {/* Appel de la fonction du parent pour l'édition */}
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(t)}>
                            <EditIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(t.id)}
                            disabled={isDeleting === t.id}
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
                  <TableHead>{type === "income" ? "SOURCE" : "CATEGORY"}</TableHead>
                  <TableHead>DATE</TableHead>
                  <TableHead>DESCRIPTION</TableHead>
                  <TableHead className="text-right">ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((t) => (
                  <motion.tr key={t.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-muted/30">
                    <TableCell className={getTypeColor(type)}>
                      {type === "income" ? "+" : "-"} {formatAmount(t.amount)}
                    </TableCell>
                    <TableCell>{type === "income" ? t.source : t.category}</TableCell>
                    <TableCell>{formatDate(t.date)}</TableCell>
                    <TableCell>{t.description || "—"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* Appel de la fonction du parent pour l'édition */}
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(t)}>
                          <EditIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(t.id)}
                          disabled={isDeleting === t.id}
                        >
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
    </div>
  );
};

export default TransactionList;