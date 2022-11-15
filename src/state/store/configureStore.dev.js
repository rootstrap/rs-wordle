import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';

import reducer from 'state/reducer';
import { api } from 'services/api';

const middleware = getDefaultMiddleware => getDefaultMiddleware().concat(logger, api.middleware);

const store = configureStore({
  reducer,
  middleware,
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
