import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';

import reducer from 'state/reducers/reducer';
import { api } from 'services/api';

const middleware = getDefaultMiddleware => getDefaultMiddleware().concat(logger, api.middleware);

const store = () => {
  const store = configureStore({
    reducer,
    middleware,
    devTools: process.env.NODE_ENV !== 'production',
  });

  return store;
};

export default store;
