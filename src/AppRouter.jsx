// src/AppRouter.jsx (version corrigée)
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; // ← Supprimé BrowserRouter
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { FinanceDashboard } from './pages/FinanceDashboard';
import { Profile } from './pages/Profile';
import Layout from './components/layout/Layout';
import Income from './pages/Income';
import Expenses from './pages/Expenses';
import { ProtectedRoute } from './context/ProtectedRoute';
import { CategoryManager } from './pages/category-manager';

export function AppRouter() {
  return (
    <Routes> {/* ← Seulement Routes ici, pas de BrowserRouter */}
      {/* Routes publiques */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Route racine : Redirige vers dashboard si authentifié, sinon login */}
      <Route 
        path="/" 
        element={
          <Navigate to="/dashboard" replace /> // ← Optionnel : Redirection simple
        } 
      />

      {/* ⬅️ Wrapping protected routes with <ProtectedRoute> */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Layout>
            <FinanceDashboard />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/income" element={
        <ProtectedRoute>
          <Layout>
            <Income />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/expenses" element={
        <ProtectedRoute>
          <Layout>
            <Expenses />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/category" element={
        <ProtectedRoute>
          <Layout>
            <CategoryManager />
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

      {/* Catch-all pour 404 */}
      <Route path="*" element={<div>404 - Page non trouvée</div>} />
    </Routes>
  );
}