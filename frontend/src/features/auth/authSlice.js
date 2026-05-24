import { createSlice } from '@reduxjs/toolkit';

// IMPORTANT: Tokens are stored in HttpOnly cookies by the backend
// But we also need to store in Redux for cross-domain requests (Vercel → Render)
// HttpOnly cookies don't get sent in cross-origin requests
const initialState = {
  user: null,
  accessToken: null, // For cross-domain requests: Vercel → Render
  isLoading: false,
  isAuthenticated: false,
  isAuthInitialized: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, accessToken } = action.payload;
      state.user = user;
      state.accessToken = accessToken; // Save token for cross-domain requests
      state.isAuthenticated = !!user;
      // IMPORTANTE: Guardar en sessionStorage para persistir después de reload
      // SessionStorage es seguro (se borra al cerrar la pestaña)
      if (accessToken) {
        try {
          sessionStorage.setItem('_auth_token', accessToken);
        } catch (e) {
          console.warn('Could not save token to sessionStorage:', e);
        }
      }
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
      if (action.payload) {
        try {
          sessionStorage.setItem('_auth_token', action.payload);
        } catch (e) {
          console.warn('Could not save token to sessionStorage:', e);
        }
      }
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setAuthInitialized: (state, action) => {
      state.isAuthInitialized = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      // Limpiar sessionStorage
      try {
        sessionStorage.removeItem('_auth_token');
      } catch (e) {
        console.warn('Could not clear sessionStorage:', e);
      }
    },
    restoreFromSessionStorage: (state) => {
      // Restaurar token de sessionStorage después de reload
      try {
        const token = sessionStorage.getItem('_auth_token');
        if (token) {
          state.accessToken = token;
          // No restauramos user aquí, getMe lo hará
        }
      } catch (e) {
        console.warn('Could not restore from sessionStorage:', e);
      }
    },
  },
});

export const { setCredentials, setUser, setAccessToken, setLoading, setAuthInitialized, logout, restoreFromSessionStorage } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectAccessToken = (state) => state.auth.accessToken;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsLoading = (state) => state.auth.isLoading;
export const selectIsAuthInitialized = (state) => state.auth.isAuthInitialized;
export const selectIsAdmin = (state) => state.auth.user?.role === 'admin';
export const selectIsTecnico = (state) => state.auth.user?.role === 'tecnico';
export const selectIsDespachante = (state) => state.auth.user?.role === 'despachante';
