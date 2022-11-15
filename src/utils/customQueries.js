import { fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';
import { ACCESS_TOKEN, APPLICATION_JSON, CLIENT, CONTENT_TYPE, UID } from 'constants/headers';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.REACT_APP_API_URL,
  prepareHeaders: (headers, { getState }) => {
    const state = getState();
    const { user } = state.auth;

    if (user?.token) {
      headers.set(CONTENT_TYPE, APPLICATION_JSON);
      headers.set(ACCESS_TOKEN, user.token);
      headers.set(CLIENT, user.client);
      headers.set(UID, user.uid);
    }
    return headers;
  },
});

export const baseQueryWithReauth = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);
  const headers = result?.meta?.response?.headers;
  const token = headers?.get(ACCESS_TOKEN);

  if (token) {
    const session = {
      token,
      uid: headers.get(UID),
      client: headers.get(CLIENT),
    };

    result.data.info = session;
  }

  return result;
};
