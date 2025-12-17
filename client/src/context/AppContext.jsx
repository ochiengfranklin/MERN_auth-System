import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

export const AppContent = createContext();

export const AppContextProvider = ({ children }) => {
    axios.defaults.withCredentials = true;

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [isLoggedin, setIsLoggedin] = useState(false);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    // ✅ Check auth state
    const getAuthState = async () => {
        try {
            const { data } = await axios.get(
                backendUrl + '/api/auth/is-auth',
                { withCredentials: true }
            );

            if (data.success) {
                setIsLoggedin(true);
                await getUserData();
            }
        } catch (error) {
            // ✅ THIS IS NORMAL — user is simply logged out
            setIsLoggedin(false);
            setUserData(null);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Get user data
    const getUserData = async () => {
        try {
            const { data } = await axios.get(
                backendUrl + '/api/user/data',
                { withCredentials: true }
            );

            if (data.success) {
                setUserData(data.userData);
            } else {
                setIsLoggedin(false);
                setUserData(null);
            }
        } catch (error) {
            setIsLoggedin(false);
            setUserData(null);
        }
    };

    useEffect(() => {
        getAuthState();
    }, []);

    const value = {
        backendUrl,
        isLoggedin,
        setIsLoggedin,
        userData,
        setUserData,
        getUserData,
        loading
    };

    return (
        <AppContent.Provider value={value}>
            {!loading && children}
        </AppContent.Provider>
    );
};
