// src/context/useJsonUser.js
import { useEffect, useState } from "react";
import { getUser } from "./userService";

export function useJsonUser() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUser();
        setUser(data);
      } catch (error) {
        console.error("Erreur lors du fetch user:", error);
      }
    };
    fetchUser();
  }, []);

  return user;
}
