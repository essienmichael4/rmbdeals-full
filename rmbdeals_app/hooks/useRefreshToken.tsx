import axios from 'axios';
import useAuth from '../hooks/useAuth';


const useRefreshToken = () => {
  const {auth, dispatch} = useAuth();
  const refresh = async () => {
    const refreshToken = auth?.backendTokens?.refreshToken;
    if (!refreshToken) throw new Error('No refresh token available');

    try {
      const { data } = await axios.get("https://api.rmbdeals.com/api/v1/auth/refresh-token", {
        headers: {
          'Authorization': `Refresh ${refreshToken}`
        }
      });
      
      // Ensure auth exists before updating
      if (!auth) {
        throw new Error('Auth context not available');
      }

      // Safely update with null checks
      const updatedAuth = {
        ...auth,
        backendTokens: {
          ...(auth.backendTokens || {}),
          accessToken: data.accessToken,
          refreshToken: data.refreshToken
        }
      };
      
      dispatch({ type: 'ADD_AUTH', payload: updatedAuth });
      return data.accessToken;
    } catch (error) {
      console.error('Token refresh failed:', error);
      throw error;
    }
  };

  return refresh;
};

export default useRefreshToken;
