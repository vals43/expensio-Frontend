// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

export function ProtectedRoute({ children }) {
  const token = localStorage.getItem('jwtToken');

  if (!token) {
    // If there's no token, redirect the user to the login page.
    return <Navigate to="/login" replace />;
  }

  // If a token exists, render the child components (the protected page).
  return children;
}