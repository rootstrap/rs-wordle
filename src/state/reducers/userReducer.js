import { createReducer } from '@rootstrap/redux-tools';

import { login, logout } from 'state/actions/userActions';

const initialState = {
  authenticated: false,
  user: null,
};

const handleLogin = (state, { payload }) => {
  const { user } = payload;
  state.user = user;
  state.authenticated = true;
};

const handleLogout = () => {
  return { ...initialState };
};

export default createReducer(initialState, {
  [login]: handleLogin,
  [logout]: handleLogout,
});
