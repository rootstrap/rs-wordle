import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from 'utils/customQueries';

// initialize an empty api service that we'll inject endpoints into later as needed
export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
});
