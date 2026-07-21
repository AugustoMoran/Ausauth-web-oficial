import { baseApi } from './baseApi';

export const testimonialsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTestimonials: builder.query({
      query: () => '/testimonials',
      providesTags: ['Testimonial'],
    }),
    createTestimonial: builder.mutation({
      query: (body) => ({
        url: '/testimonials',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Testimonial'],
    }),
    updateTestimonial: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/testimonials/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Testimonial'],
    }),
    deleteTestimonial: builder.mutation({
      query: (id) => ({
        url: `/testimonials/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Testimonial'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetTestimonialsQuery,
  useCreateTestimonialMutation,
  useUpdateTestimonialMutation,
  useDeleteTestimonialMutation,
} = testimonialsApi;
