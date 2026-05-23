import { baseApi } from './baseApi';

export const downloadApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDownloads: builder.query({
      query: () => '/downloads',
      providesTags: ['Download'],
    }),
    createDownload: builder.mutation({
      query: (data) => ({ url: '/downloads', method: 'POST', body: data }),
      invalidatesTags: ['Download'],
    }),
    updateDownload: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/downloads/${id}`, method: 'PUT', body: data }),
      invalidatesTags: ['Download'],
    }),
    deleteDownload: builder.mutation({
      query: (id) => ({ url: `/downloads/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Download'],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetDownloadsQuery,
  useCreateDownloadMutation,
  useUpdateDownloadMutation,
  useDeleteDownloadMutation,
} = downloadApi;
