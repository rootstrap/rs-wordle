import { configureStore } from '@reduxjs/toolkit';

import reducer from 'state/reducers/reducer';

const store = initialState => {
  const store = configureStore({
    reducer,
    preloadedState: initialState,
  });

  return store;
};

export default store;
