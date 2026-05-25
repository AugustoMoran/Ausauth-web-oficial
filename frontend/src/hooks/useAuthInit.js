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
  const { data: user, isLoading, error } = useGetMeQuery(undefined);

  useEffect(() => {
    dispatch(setLoading(isLoading));

    if (initialized.current && isLoading) return;

    if (user && !isLoading && !initialized.current) {
      dispatch(setUser(user));
      dispatch(setAuthInitialized(true));
      initialized.current = true;
      return;
    }

    if (error && !isLoading && !initialized.current) {
      const hadToken = !!sessionStorage.getItem('_auth_token');
      const status = error?.status || error?.originalStatus;

      // Si no había sesión previa y recibimos 401, tratar como visitante normal
      if (status === 401 && !hadToken) {
        dispatch(setAuthInitialized(true));
        initialized.current = true;
        return;
      }

      // Si sí había token previo, limpiar estado inconsistente
      dispatch(logout());
      dispatch(setAuthInitialized(true));
      initialized.current = true;
    }
  }, [user, error, isLoading, dispatch]);

  return isLoading;
};

export default useAuthInit;
