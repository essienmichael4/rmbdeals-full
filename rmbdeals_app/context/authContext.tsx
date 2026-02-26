import React, {
  createContext,
  useEffect,
  useState,
  ReactNode,
  useReducer,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthType } from "../types";


/* ======================================================
   Types
====================================================== */

interface Action {
  type: "ADD_AUTH" | "REMOVE_AUTH" | "RESTORE_AUTH" | "UPDATE_AUTH";
  payload?: AuthType | Partial<AuthType>;
}

export interface IContextProps {
  auth: AuthType | undefined;
  dispatch: React.Dispatch<Action>;
  loading: boolean;
}

/* ======================================================
   Context
====================================================== */

export const AuthContext = createContext<IContextProps>({
  auth: undefined,
  dispatch: () => { },
  loading: true,
});

/* ======================================================
   Reducer
====================================================== */

export const AuthReducer = (
  state: AuthType | undefined,
  action: Action
): AuthType | undefined => {
  switch (action.type) {
    case "ADD_AUTH":
      return action.payload as AuthType;

    case "RESTORE_AUTH":
      return action.payload as AuthType;

    case "REMOVE_AUTH":
      return undefined;

    case "UPDATE_AUTH":
      return state ? { ...state, ...action.payload } : state;

    default:
      return state;
  }
};

/* ======================================================
   Provider
====================================================== */

const AUTH_STORAGE_KEY = "cslauth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, dispatch] = useReducer(AuthReducer, undefined);
  const [loading, setLoading] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  // Restore auth
  useEffect(() => {
    const loadAuth = async () => {
      try {
        console.log('[AUTH] Loading auth from storage...');
        const storedAuth = await AsyncStorage.getItem(AUTH_STORAGE_KEY);

        if (storedAuth) {
          console.log('[AUTH] Auth found in storage, restoring...');
          dispatch({
            type: "RESTORE_AUTH",
            payload: JSON.parse(storedAuth),
          });
        } else {
          console.log('[AUTH] No auth found in storage');
        }
      } catch (error) {
        console.error("[AUTH] Failed to load auth state", error);
      } finally {
        console.log('[AUTH] Auth loading complete');
        setLoading(false);
        setHydrated(true);
      }
    };

    loadAuth();
  }, []);

  // Persist auth ONLY after hydration
  useEffect(() => {
    if (!hydrated) return;

    const persistAuth = async () => {
      try {
        if (auth) {
          await AsyncStorage.setItem(
            AUTH_STORAGE_KEY,
            JSON.stringify(auth)
          );
        } else {
          await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
        }
      } catch (error) {
        console.error("Failed to persist auth state", error);
      }
    };

    persistAuth();
  }, [auth, hydrated]);

  return (
    <AuthContext.Provider value={{ auth, dispatch, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
