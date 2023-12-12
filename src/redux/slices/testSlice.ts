import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { REHYDRATE } from 'redux-persist';

import { getUserProfile } from '../../helpers/firestoreService';

export const postsApi = createApi({
  reducerPath: 'posts',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Post'],
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === REHYDRATE) {
      return action.payload[reducerPath];
    }
  },
  endpoints: (builder) => ({
    fetchPosts: builder.query({
      // since we are using fakeBaseQuery we use queryFn
      async queryFn() {
        try {
          const data = await getUserProfile(
            'AnzZ3QteQWhzLibpAe6LPwhXX7o1',
            'N11 Validation'
          );

          return { data };
        } catch (error) {
          return { error };
        }
      },
      providesTags: ['Post']
    }),

    fetchSinglePost: builder.query<any, void>({
      queryFn: async () => {
        try {
          const data = await getUserProfile(
            'AnzZ3QteQWhzLibpAe6LPwhXX7o1',
            'N11 Validation'
          );

          return { data };
        } catch (error) {
          return { error };
        }
      },
      providesTags: ['Post']
    })
  })
});

export const { useFetchPostsQuery, useFetchSinglePostQuery } = postsApi;
