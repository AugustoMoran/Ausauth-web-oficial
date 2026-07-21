import { baseApi } from './baseApi';

export const projectsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query({
      query: (params) => ({ url: '/projects', params }),
      providesTags: (result) =>
        result?.projects
          ? [...result.projects.map(({ _id }) => ({ type: 'Project', id: _id })), { type: 'Project', id: 'LIST' }]
          : [{ type: 'Project', id: 'LIST' }],
    }),
    getProject: builder.query({
      query: (id) => `/projects/${id}`,
      providesTags: (result, error, id) => [{ type: 'Project', id }],
    }),
    getRelatedProjects: builder.query({
      query: (id) => `/projects/${id}/related`,
      providesTags: ['Project'],
    }),
    getProjectSuggestions: builder.query({
      query: (q) => ({ url: '/projects/suggestions', params: { q, limit: 10 } }),
    }),
    createProject: builder.mutation({
      query: (data) => ({ url: '/projects', method: 'POST', body: data }),
      invalidatesTags: [{ type: 'Project', id: 'LIST' }],
    }),
    updateProject: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/projects/${id}`, method: 'PUT', body: data }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Project', id }, { type: 'Project', id: 'LIST' }],
    }),
    deleteProject: builder.mutation({
      query: (id) => ({ url: `/projects/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'Project', id: 'LIST' }],
    }),
    addProjectImage: builder.mutation({
      query: ({ id, url, publicId }) => ({ url: `/projects/${id}/images`, method: 'POST', body: { url, publicId } }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Project', id }],
    }),
    removeProjectImage: builder.mutation({
      query: ({ id, publicId }) => ({ url: `/projects/${id}/images`, method: 'DELETE', body: { publicId } }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Project', id }],
    }),
    addProjectVideo: builder.mutation({
      query: ({ id, url, publicId }) => ({ url: `/projects/${id}/videos`, method: 'POST', body: { url, publicId } }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Project', id }],
    }),
    removeProjectVideo: builder.mutation({
      query: ({ id, publicId }) => ({ url: `/projects/${id}/videos`, method: 'DELETE', body: { publicId } }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Project', id }],
    }),
    getCategories: builder.query({
      query: () => '/categories',
      providesTags: ['Category'],
    }),
    createCategory: builder.mutation({
      query: (data) => ({ url: '/categories', method: 'POST', body: data }),
      invalidatesTags: ['Category'],
    }),
    updateCategory: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/categories/${id}`, method: 'PUT', body: data }),
      invalidatesTags: ['Category'],
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({ url: `/categories/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Category'],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetProjectsQuery,
  useGetProjectQuery,
  useGetRelatedProjectsQuery,
  useGetProjectSuggestionsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useAddProjectImageMutation,
  useRemoveProjectImageMutation,
  useAddProjectVideoMutation,
  useRemoveProjectVideoMutation,
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = projectsApi;
