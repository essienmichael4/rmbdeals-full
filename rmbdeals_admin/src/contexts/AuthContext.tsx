import React, { createContext, useCallback, useEffect, useState } from "react";

type User = Record<string, any> | null;

export type AuthContextType = {
    user: User;
    token: string | null;
    loading: boolean;
    login: (token: string, user?: User) => void;
    logout: () => void;
    setUser: (user: User) => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    const [user, setUser] = useState<User>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const storedToken = localStorage.getItem("auth_token");
            const storedUser = localStorage.getItem("auth_user");
            if (storedToken) setToken(storedToken);
            if (storedUser) setUser(JSON.parse(storedUser));
        } catch (e) {
            console.warn("Failed to parse auth from storage", e);
        } finally {
            setLoading(false);
        }
    }, []);

    const login = useCallback((newToken: string, newUser?: User) => {
        setToken(newToken);
        if (newUser !== undefined) setUser(newUser);
        localStorage.setItem("auth_token", newToken);
        if (newUser !== undefined) localStorage.setItem("auth_user", JSON.stringify(newUser));
    }, []);

    const logout = useCallback(() => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
    }, []);

    const value: AuthContextType = {
        user,
        token,
        loading,
        login,
        logout,
        setUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
