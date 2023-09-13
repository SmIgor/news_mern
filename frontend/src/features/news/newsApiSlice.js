import { createSelector, createEntityAdapter } from '@reduxjs/toolkit'
import { apiSlice } from '../../app/api/apiSlice'

const newsAdapter = createEntityAdapter({
  sortComparer: (a, b) => {
    const aDate = new Date(a.createdAt).getTime()
    const bDate = new Date(b.createdAt).getTime()
    return bDate - aDate
  },
})

const initialState = newsAdapter.getInitialState()

export const newsApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getNews: builder.query({
      query: () => '/news',
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError
      },
      transformResponse: responseData => {
        const loadedNews = responseData.map(news => {
          news.id = news._id
          return news
        })
        return newsAdapter.setAll(initialState, loadedNews)
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: 'News', id: 'LIST' },
            ...result.ids.map(id => ({ type: 'News', id })),
          ]
        } else return [{ type: 'News', id: 'LIST' }]
      },
    }),
    addNewNews: builder.mutation({
      query: initialNews => ({
        url: '/news',
        method: 'POST',
        body: {
          ...initialNews,
        },
      }),
      invalidatesTags: [{ type: 'News', id: 'LIST' }],
    }),
    updateNews: builder.mutation({
      query: initialNews => ({
        url: '/news',
        method: 'PATCH',
        body: {
          ...initialNews,
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'News', id: 'LIST' }],
    }),
    deleteNews: builder.mutation({
      query: ({ id }) => ({
        url: `/news`,
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'News', id: arg.id }],
    }),
  }),
})

export const {
  useGetNewsQuery,
  useAddNewNewsMutation,
  useUpdateNewsMutation,
  useDeleteNewsMutation,
} = newsApiSlice

export const selectNewsResult = newsApiSlice.endpoints.getNews.select()

const selectNewsData = createSelector(
  selectNewsResult,
  newsResult => newsResult.data
)

export const {
  selectAll: selectAllNews,
  selectById: selectNewsById,
  selectIds: selectNewsIds,
} = newsAdapter.getSelectors(state => selectNewsData(state) ?? initialState)
