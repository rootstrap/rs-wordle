import { configureStore } from '@reduxjs/toolkit';
import { persistStore } from 'redux-persist';
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

  const persistor = persistStore(store);

  return { store, persistor };
};

export default store;
