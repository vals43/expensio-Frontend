import React from 'react';
import { ThemeProvider } from './components/theme/ThemeProvider';
import { AppRouter } from './AppRouter';
import { UserProvider } from './api/user/userContext';
import { IncomeProvider } from './api/incomes/getJsonIncomes';
export default function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <IncomeProvider>

          <AppRouter />
        </IncomeProvider>
      </UserProvider>
    </ThemeProvider>
  )
}