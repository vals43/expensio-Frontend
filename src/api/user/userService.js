// src/context/userService.js
import apiClient from "../auth/apiClient";

// You no longer need to import axios directly or getToken
// import axios from "axios";
// import { getToken } from "../auth/authService";

// You no longer need the BACKEND_URL variable either
// const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;

export async function getUser() {
  try {
    // Use apiClient.get()
    const response = await apiClient.get("/api/user/profile");

    return response.data;
  } catch (error) {
    console.error("Error in getUser:", error.response?.data || error.message);
    throw error;
  }
}

export async function changePassword(oldPassword, newPassword) {
  try {
    // Use apiClient.post()
    const response = await apiClient.post(
      "/api/user/change-password",
      { oldPassword, newPassword }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error in changePassword:",
      error.response?.data || error.message
    );
    throw error;
  }
}