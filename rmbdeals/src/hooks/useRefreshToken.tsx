import useAuth from "./useAuth";
import { axios_instance } from "@/api/axios";

const useRefreshToken = () => {
  const { auth, dispatch } = useAuth();

  const refresh = async () => {
    if (!auth?.backendTokens.refreshToken) return;

    try {
      const response = await axios_instance.get("/auth/refresh-token", {
        headers: {
          Authorization: `Refresh ${auth.backendTokens.refreshToken}`,
        },
      });

      const newAccessToken = response.data.accessToken;

      dispatch({
        type: "ADD_AUTH",
        payload: {
          ...auth,
          backendTokens: {
            accessToken: newAccessToken,
            refreshToken: auth.backendTokens.refreshToken,
          },
        },
      });

      return newAccessToken;
    } catch (error) {
      dispatch({ type: "REMOVE_AUTH" });
      throw error;
    }
  };

  return refresh;
};

export default useRefreshToken;
