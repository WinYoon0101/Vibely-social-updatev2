"use client";
import { createContext, useEffect, useReducer, useState } from "react";
import AuthReducer from "./AuthReducer";

export const AuthContext = createContext(null);

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AuthReducer, {
        user: null,
        isFetching: false,
        error: false,
    });

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const storedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null;
        if (storedUser) {
            dispatch({ type: "LOGIN_SUCCESS", payload: JSON.parse(storedUser) });
        }
    }, []);

    useEffect(() => {
        if (isMounted) {
            localStorage.setItem("user", JSON.stringify(state.user));
        }
    }, [state.user, isMounted]);

    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
};
