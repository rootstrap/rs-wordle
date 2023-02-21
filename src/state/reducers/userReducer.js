import { createReducer } from '@rootstrap/redux-tools';

import { login, logout, setOnboardingShown } from 'state/actions/userActions';

const initialState = {
  authenticated: false,
  user: null,
  wasOnboardingShown: false,
};

const handleLogin = (state, { payload }) => {
  const { user } = payload;
  state.user = user;
  state.authenticated = true;
};

const handleSetOnboardingShown = state => {
  state.wasOnboardingShown = true;
};

const handleLogout = () => {
  return { ...initialState };
};

export default createReducer(initialState, {
  [login]: handleLogin,
  [logout]: handleLogout,
  [setOnboardingShown]: handleSetOnboardingShown,
});
