// src/AppRouter.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { FinanceDashboard } from './pages/FinanceDashboard';
import { Profile } from './pages/Profile';
import Layout from './components/layout/Layout';
import Income from './pages/Income';
import { TransactionProvider } from './context/TransactionContext';
import Expenses from './pages/Expenses';
import { ProtectedRoute } from './context/ProtectedRoute';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ⬅️ Wrapping protected routes with <ProtectedRoute> */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Layout>
              <FinanceDashboard />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/" element={
          <ProtectedRoute>
            <Layout>
              <FinanceDashboard />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/income" element={
          <ProtectedRoute>
            <Layout>
              <TransactionProvider>
                <Income />
              </TransactionProvider>
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/expenses" element={
          <ProtectedRoute>
            <Layout>
              <TransactionProvider>
                <Expenses />
              </TransactionProvider>
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <Layout>
              <Profile />
            </Layout>
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}