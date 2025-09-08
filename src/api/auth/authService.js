import apiClient from "../auth/apiClient";
import { useNavigate } from "react-router-dom";

// Fonction de connexion
export const login = async (credentials) => {
  try {
    const response = await apiClient.post("/auth/login", credentials);
    const { token } = response.data;
    // Stocke le token dans le localStorage
    localStorage.setItem("jwtToken", token);
    return response.data;
  } catch (error) {
    console.error("Login failed:", error.response?.data);
    throw error;
  }
};

// Fonction de déconnexion
export const logout = () => {
  localStorage.removeItem("jwtToken");
};

// Fonction pour récupérer le token
export const getToken = () => {
  return localStorage.getItem("jwtToken");
};

// Fonction pour vérifier si l'utilisateur est authentifié
export const isAuthenticated = () => {
  const token = getToken();
  return !!token;
};
