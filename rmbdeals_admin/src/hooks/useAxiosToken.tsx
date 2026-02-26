import { useEffect } from "react";
import useAuth from "./useAuth";
import { axios_instance_token } from "@/api/axios";
import { useNavigate } from "react-router-dom";
import useRefreshToken from "./useRefreshToken";

const useAxiosToken = () => {
    const { auth } = useAuth();
    const navigate = useNavigate();
    const refresh = useRefreshToken();

    useEffect(() => {
        const requestInterceptor = axios_instance_token.interceptors.request.use(
            (config) => {
                const accessToken = auth?.backendTokens?.accessToken;
                if (accessToken) {
                    // ensure headers object exists and set Authorization
                    config.headers = config.headers || {};
                    (config.headers as any).Authorization = `Bearer ${accessToken}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        const responseInterceptor = axios_instance_token.interceptors.response.use(
            (response) => response,
            async (error) => {
                const previousRequest = error?.config;
                if (!previousRequest) return Promise.reject(error);

                // use a retry flag to avoid infinite loops
                if (error?.response?.status === 401 && !previousRequest._retry) {
                    previousRequest._retry = true;

                    const newAccessToken = await refresh();
                    if (!newAccessToken) {
                        // refresh failed -> redirect to login
                        navigate("/login", { replace: true });
                        return Promise.reject(error);
                    }

                    previousRequest.headers = previousRequest.headers || {};
                    previousRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return axios_instance_token(previousRequest);
                }

                if (error?.response?.status === 401 && previousRequest._retry) {
                    // already retried, force logout/redirect
                    navigate("/", { replace: true });
                }

                return Promise.reject(error);
            }
        );

        return () => {
            axios_instance_token.interceptors.request.eject(requestInterceptor);
            axios_instance_token.interceptors.response.eject(responseInterceptor);
        };
    }, [auth?.backendTokens?.accessToken, refresh, navigate]);

    return axios_instance_token;
};

export default useAxiosToken;
