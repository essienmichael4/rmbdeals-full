import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext2";
import type { IContextProps } from "@/contexts/AuthContext2";

export default function useAuth(): IContextProps {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}