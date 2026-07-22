import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logout, setCredentials } from '../features/auth/authSlice';
import config from '../config/app';

// Determinar URL base en cada request (no compilación)
// Para desarrollo: usa /api (proxy Vite)
// Para producción: usa URL absoluta (no confiar en paths relativos con Vercel rewrites)
const getBaseUrlForRequest = () => {
  // Usar la URL configurada en app.js (que lee de env variables)
  const configuredUrl = config.apiUrl;
  
  // Si estamos en navegador
  if (typeof window !== 'undefined' && window.location) {
    const hostname = window.location.hostname;
    
    // En desarrollo local
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('localhost:')) {
      return '/api';
    }
  }
  
  // En producción, SIEMPRE usar URL configurada (absoluta)
  return configuredUrl;
};

// Llamar una sola vez pero permitir que window se resuelva correctamente
const BASE_URL = getBaseUrlForRequest();

// Store token in memory (perdido al recargar, es seguro)
let accessToken = null;
const AUTH_CLIENT_REV = '2026-05-25-redeploy-r3';

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: 'include', // Intenta enviar cookies
  prepareHeaders: (headers, { getState }) => {
    // Obtener token del Redux store primero (persiste entre reloads)
    const state = getState();
    let token = state?.auth?.accessToken;
    
    // Fallback: intentar desde sessionStorage (más seguro que localStorage, se borra al cerrar)
    if (!token) {
      token = sessionStorage.getItem('_auth_token');
    }
    
    // Fallback final: usar token en memoria
    if (!token) {
      token = accessToken;
    }
    
    // FALLBACK: Si no hay cookie, usar token en memoria + Authorization header
    // Esto es necesario para cross-domain (www.ausauth.com → back-end-url)
    if (AUTH_CLIENT_REV && typeof token === 'string' && token.length > 0) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    // Try to refresh tokens
    const refreshResult = await baseQuery(
      { url: '/auth/refresh', method: 'POST' },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      // Guardar nuevo token en memoria Y en Redux
      if (refreshResult.data.accessToken) {
        setMemoryToken(refreshResult.data.accessToken);
        // También actualizar en Redux
        const state = api.getState();
        if (refreshResult.data.user) {
          api.dispatch(setCredentials({ 
            user: refreshResult.data.user,
            accessToken: refreshResult.data.accessToken 
          }));
        } else {
          // Si no viene usuario, al menos actualizar el token
          api.dispatch(setCredentials({ 
            user: state.auth.user,
            accessToken: refreshResult.data.accessToken 
          }));
        }
      }
      // Backend automatically updated cookies
      // Just retry the original request
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Refresh failed - user must login again
      accessToken = null;
      api.dispatch(logout());
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'Project', 
    'Category', 
    'User', 
    'Users', 
    'Quote', 
    'Service', 
    'Testimonial', 
    'FAQ', 
    'Job', 
    'Upload', 
    'Popup'
  ],
  endpoints: () => ({}),
});

// Export baseQueryWithReauth for other APIs to use
export { baseQueryWithReauth };

// Exportar función para actualizar token en memoria
export const setMemoryToken = (token) => {
  accessToken = token;
  // También guardar en sessionStorage para usar en requests después de recargar
  // SessionStorage es más seguro que localStorage - se borra al cerrar la pestaña
  if (token) {
    sessionStorage.setItem('_auth_token', token);
    sessionStorage.setItem('quoteToken', token);
  }
};

export const getMemoryToken = () => {
  // Intentar obtener del memory primero, luego del sessionStorage
  return accessToken || sessionStorage.getItem('quoteToken');
};

export const clearMemoryToken = () => {
  accessToken = null;
  sessionStorage.removeItem('_auth_token');
  sessionStorage.removeItem('quoteToken');
};
