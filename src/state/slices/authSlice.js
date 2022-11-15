import { createSlice, isAnyOf } from '@reduxjs/toolkit';

import { loginFulfilled, logoutFulfilled, signupFulfilled } from 'services/auth/auth';
import { getLoggedInUser, removeLoggedInUser, setLoggedInUser } from 'utils/auth';

const loggedInUser = getLoggedInUser();

const defaultState = {
  authenticated: false,
  user: {},
};

const initialState = {
  authenticated: !!loggedInUser,
  user: loggedInUser,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  extraReducers: builder => {
    builder.addMatcher(
      isAnyOf(loginFulfilled, signupFulfilled),
      (_state, { payload: { info, data, ...rest } }) => {
        const user = { ...info, ...data, ...rest };

        setLoggedInUser(user);

        return {
          authenticated: true,
          user,
        };
      }
    );
    builder.addMatcher(logoutFulfilled, () => {
      removeLoggedInUser();

      return defaultState;
    });
  },
});

export const { setUser } = authSlice.actions;

export default authSlice.reducer;
