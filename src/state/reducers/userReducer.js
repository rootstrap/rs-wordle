import { createReducer } from '@rootstrap/redux-tools';

import { setOnboardingShown } from 'state/actions/userActions';

const initialState = {
  authenticated: false,
  user: null,
  wasOnboardingShown: false,
};

const handleSetOnboardingShown = state => {
  state.wasOnboardingShown = true;
};

export default createReducer(initialState, {
  [setOnboardingShown]: handleSetOnboardingShown,
});
