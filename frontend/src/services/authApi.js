import { baseApi, setMemoryToken, clearMemoryToken } from './baseApi';
import { setCredentials, logout } from '../features/auth/authSlice';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (data) => ({ url: '/auth/register', method: 'POST', body: data }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Guardar token en memoria para cross-domain
          if (data.accessToken) {
            setMemoryToken(data.accessToken);
          }
          dispatch(setCredentials({ user: data.user }));
        } catch {
          // Component handles error display
        }
      },
    }),
    login: builder.mutation({
      query: (data) => ({ url: '/auth/login', method: 'POST', body: data }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Guardar token en memoria para cross-domain (fallback si cookies no funciona)
          if (data.accessToken) {
            setMemoryToken(data.accessToken);
          }
          dispatch(setCredentials({ user: data.user }));
        } catch {
          // Component handles error display
        }
      },
    }),
    logout: builder.mutation({
      query: () => ({ url: '/auth/logout', method: 'POST' }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          clearMemoryToken();
          dispatch(logout());
        } catch {
          clearMemoryToken();
          dispatch(logout());
        }
      },
    }),
    getMe: builder.query({
      query: () => '/auth/me',
      providesTags: ['User'],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Restore token from getMe response after page reload
          if (data.accessToken) {
            setMemoryToken(data.accessToken);
          }
          // Update Redux state with user data
          if (data.user) {
            dispatch(setCredentials({ user: data.user }));
          }
        } catch (error) {
          // If getMe fails, user is not authenticated
          // Skip - the error is handled by useAuthInit
        }
      },
    }),
    updateProfile: builder.mutation({
      query: (data) => ({ url: '/users/profile', method: 'PUT', body: data }),
      invalidatesTags: ['User'],
    }),
    getFavorites: builder.query({
      query: () => '/users/favorites',
      providesTags: ['User'],
    }),
    toggleFavorite: builder.mutation({
      query: (productId) => ({ url: `/users/favorites/${productId}`, method: 'POST' }),
      invalidatesTags: ['User'],
    }),
  }),
  overrideExisting: true,
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetMeQuery,
  useUpdateProfileMutation,
  useGetFavoritesQuery,
  useToggleFavoriteMutation,
} = authApi;
