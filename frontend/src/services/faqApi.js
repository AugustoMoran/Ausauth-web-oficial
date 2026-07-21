import { baseApi } from './baseApi';

export const faqApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFAQs: builder.query({
      query: () => '/faqs',
      providesTags: ['FAQ'],
    }),
    createFAQ: builder.mutation({
      query: (body) => ({
        url: '/faqs',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['FAQ'],
    }),
    updateFAQ: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/faqs/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['FAQ'],
    }),
    deleteFAQ: builder.mutation({
      query: (id) => ({
        url: `/faqs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['FAQ'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetFAQsQuery,
  useCreateFAQMutation,
  useUpdateFAQMutation,
  useDeleteFAQMutation,
} = faqApi;
