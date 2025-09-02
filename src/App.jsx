import React from 'react';
import { ThemeProvider } from './components/theme/ThemeProvider';
import { AppRouter } from './AppRouter';
import { UserProvider } from './api/user/userContext';
import { IncomeProvider } from './api/incomes/getJsonIncomes';
import { ExpenseProvider } from './api/expenses/expenseContext';
import { CategoryProvider } from './api/category/categoryContext';
import { ReceiptProvider } from './api/receipt/receiptContext';
export default function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <IncomeProvider>
          <ExpenseProvider>
            <CategoryProvider>
              <ReceiptProvider>
                <AppRouter />
              </ReceiptProvider>
            </CategoryProvider>
          </ExpenseProvider>
        </IncomeProvider>
      </UserProvider>
    </ThemeProvider>
  )
}