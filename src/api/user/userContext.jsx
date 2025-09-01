// src/context/UserContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { isAuthenticated } from "../auth/authService";
import { getUser } from "./userService";

const UserContext = createContext(null);

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            const authenticated = isAuthenticated();
            if (authenticated) {
                try {
                    const userData = await getUser();
                    setUser(userData);
                } catch (error) {
                    console.error("Failed to fetch user data:", error);
                    // Handle token invalidation or user not found
                    setUser(null); 
                }
            }
            setLoading(false);
        };
        fetchUserData();
    }, []);

    const value = { user , authenticated : isAuthenticated() };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
}


export const useUser = () => useContext(UserContext);