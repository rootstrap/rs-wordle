import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { api } from 'services/api';

import rankingReducer from './rankingReducer';
import statisticsReducer from './statisticsReducer';
import userReducer from './userReducer';

const sessionPersistConfig = {
  key: 'user',
  storage,
  whitelist: ['authenticated', 'user', 'wasOnboardingShown'],
};

const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  ranking: rankingReducer,
  statistics: statisticsReducer,
  user: persistReducer(sessionPersistConfig, userReducer),
});

export default rootReducer;
