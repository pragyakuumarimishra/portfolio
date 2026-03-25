import { useAuthContext } from '../context/AuthContext';

/**
 * Custom hook for authentication
 * Provides access to auth state and methods
 */
export const useAuth = () => {
  return useAuthContext();
};

export default useAuth;
