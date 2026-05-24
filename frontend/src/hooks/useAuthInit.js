import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useGetMeQuery } from '../services/authApi';
import { setUser, logout, setLoading, setAuthInitialized, restoreFromSessionStorage } from '../features/auth/authSlice';

/**
 * Hook that initializes auth state on app load
 * 1. Restaura token de sessionStorage (para requests con Authorization header)
 * 2. Llama getMe para restaurar user data desde servidor
 */
export const useAuthInit = () => {
  const dispatch = useDispatch();
  const initialized = useRef(false);
  
  try {
    // Paso 1: Restaurar token de sessionStorage si existe
    useEffect(() => {
      try {
        const token = sessionStorage.getItem('_auth_token');
        if (token && !initialized.current) {
          dispatch(restoreFromSessionStorage());
        }
      } catch (e) {
        console.warn('Could not restore from sessionStorage:', e);
      }
    }, [dispatch]);

    // Paso 2: Llamar getMe para restaurar user data desde servidor
    // RTK Query usará el token de Redux para hacer la request
    const { data: user, isLoading, error } = useGetMeQuery(undefined);

    useEffect(() => {
      // Dispatch loading state
      dispatch(setLoading(isLoading));
      
      if (initialized.current && isLoading) return; // Skip if already processed and still loading
      
      if (user && !isLoading && !initialized.current) {
        dispatch(setUser(user));
        dispatch(setAuthInitialized(true));
        initialized.current = true;
      } else if (error && !isLoading && !initialized.current) {
        // No valid session - token expirado o inválido
        console.warn('⚠️ Auth failed, clearing session');
        dispatch(logout());
        dispatch(setAuthInitialized(true));
        initialized.current = true;
      }
    }, [user, error, isLoading, dispatch]);

    return isLoading;
  } catch (err) {
    // RTK Query not yet initialized, skip
    console.warn('RTK Query not ready during auth init:', err.message);
    dispatch(setLoading(false));
    dispatch(setAuthInitialized(true));
    return false;
  }
};

export default useAuthInit;
