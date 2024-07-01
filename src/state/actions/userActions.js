import { createAction } from '@rootstrap/redux-tools';

export const login = createAction('LOGIN');

export const logout = createAction('LOGOUT');

export const setOnboardingShown = createAction('SET_ONBOARDING_SHOWN');
