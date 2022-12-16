import { configureStore } from '@reduxjs/toolkit';
import { persistStore } from 'redux-persist';

import reducer from 'state/reducers/reducer';

const store = initialState => {
  const store = configureStore({
    reducer,
    preloadedState: initialState,
  });

  const persistor = persistStore(store);

  return { store, persistor };
};

export default store;
