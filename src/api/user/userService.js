// src/context/userService.js
import axios from "axios";
import { getToken } from "../auth/authService";

const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;

export async function getUser() {
  const token = getToken();

  if (!token) {
    throw new Error("No authentication token found.");
  }

  try {
    const response = await axios.get(`${BACKEND_URL}/api/user/profile`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      "Error in getUser:",
      error.response?.data || error.message
    );
    throw error;
  }
}
