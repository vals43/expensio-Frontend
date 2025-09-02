
import { getJsonIncomes } from './../../api/incomes/getJsonIncomes';
import { getJsonExpenses } from './../../api/expenses/expenseContext';
import { useCategories } from '../../api/category/categoryContext';


export default function StatProfile(){
  const incomes = getJsonIncomes();
  const expenses = getJsonExpenses();
    const { categories } = useCategories();

    

  if (!incomes || !expenses || !categories) {
    return (
      <div className="bg-light-card dark:bg-dark-card p-6 rounded-xl shadow-sm text-center text-light-text dark:text-dark-text">
        <p className="text-gray-500 dark:text-gray-400">Chargement des stats ...</p>
      </div>
    );
  }
  
  
    return (
        <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-sm mt-6">
        <h3 className="font-medium mb-4">Quick Stats</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-500">
                Total Expenses
              </span>
              <span className="text-sm font-medium">{expenses.length}</span>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-500">
                Total Incomes
              </span>
              <span className="text-sm font-medium">{incomes.length}</span>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-500">
                Total Categories
              </span>
              <span className="text-sm font-medium">{categories.length}</span>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-500">
                Recurring Expenses
              </span>
              <span className="text-sm font-medium">8</span>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-500">
                Uploaded Receipts
              </span>
              <span className="text-sm font-medium">123</span>
            </div>
          </div>
        </div>
      </div>
    )
}