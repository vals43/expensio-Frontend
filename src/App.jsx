import React from 'react';
import { ThemeProvider } from './components/theme/ThemeProvider';
import { AppRouter } from './AppRouter';
import { UserProvider } from './api/user/userContext';
export default function App() {
  return (
  <ThemeProvider>
          <UserProvider>
      <AppRouter />
    </UserProvider>
    </ThemeProvider>
  )
}