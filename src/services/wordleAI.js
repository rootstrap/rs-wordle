import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const wordleAIApi = createApi({
  reducerPath: 'wordGame',
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_API_URL }),
  endpoints: builder => ({
    getAttempts: builder.query({
      query: word => `/play_word?goal_word=${word}`,
    }),
    getWord: builder.query({
      query: () => '/word',
    }),
  }),
});

export const { useGetAttemptsQuery, useGetWordQuery } = wordleAIApi;
