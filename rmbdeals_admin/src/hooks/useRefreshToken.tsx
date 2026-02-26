import { useCallback } from "react";
import useAuth from "./useAuth";
import { axios_instance } from "@/api/axios";

const useRefreshToken = () => {
    const { auth, dispatch } = useAuth();

    const refresh = useCallback(async (): Promise<string | null> => {
        try {
            const refreshToken = auth?.backendTokens?.refreshToken;
            if (!refreshToken) return null;

            const response = await axios_instance.get("/auth/refresh-token", {
                headers: {
                    Authorization: `Refresh ${refreshToken}`,
                },
            });

            const newAccessToken = response?.data?.accessToken;
            if (!newAccessToken) return null;

            dispatch({
                type: "ADD_AUTH",
                payload: {
                    ...auth,
                    backendTokens: {
                        accessToken: newAccessToken,
                        refreshToken,
                    },
                },
            });

            return newAccessToken;
        } catch (error) {
            console.error("Failed to refresh token:", error);
            return null;
        }
    }, [auth, dispatch]);

    return refresh;
};

export default useRefreshToken;
