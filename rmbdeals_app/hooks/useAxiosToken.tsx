import { useEffect } from 'react';
import useRefreshToken from './useRefreshToken';
import { axios_instance_token } from '../_API/axios';
import { useRouter } from 'expo-router';
import useAuth from './useAuth';

const useAxiosToken = () => {
  const refresh = useRefreshToken();
  const router = useRouter();
  const { auth } = useAuth();

  useEffect(() => {
    const requestInterceptor =
      axios_instance_token.interceptors.request.use(
        async config => {
          if (!config.headers) {
            config.headers = {} as any;
          }

          if (!config.headers.Authorization) {
            const token = auth?.backendTokens?.accessToken;


            if (token) {
              config.headers.Authorization = `Bearer ${token}`;
            }
          }

          return config;
        },
        error => Promise.reject(error)
      );

    const responseInterceptor =
      axios_instance_token.interceptors.response.use(
        response => response,
        async (error: any) => {
          const previousRequest = error?.config;

          // Skip refresh endpoint itself
          if (previousRequest?.url?.includes('/auth/refresh')) {
            // await clearTokens();
            router.replace('/(auth)/login');
            return Promise.reject(error);
          }

          if (
            error?.response?.status === 401 &&
            !previousRequest?.sent
          ) {
            previousRequest.sent = true;

            try {
              const newAccessToken = await refresh();

              previousRequest.headers.Authorization = `Bearer ${newAccessToken}`;

              return axios_instance_token(previousRequest);
            } catch (err) {
              // await clearTokens();
              router.replace('/(auth)/login');
              return Promise.reject(err);
            }
          }

          if (
            error?.response?.status === 401 &&
            previousRequest?.sent
          ) {
            // await clearTokens();
            router.replace('/(auth)/login');
          }

          return Promise.reject(error);
        }
      );

    return () => {
      axios_instance_token.interceptors.request.eject(requestInterceptor);
      axios_instance_token.interceptors.response.eject(responseInterceptor);
    };
  }, [refresh, router]);

  return axios_instance_token;
};

export default useAxiosToken;
