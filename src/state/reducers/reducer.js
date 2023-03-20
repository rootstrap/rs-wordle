import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { api } from 'services/api';
import { wordleAIApi } from 'services/wordleAI';

import userReducer from './userReducer';

const sessionPersistConfig = {
  key: 'user',
  storage,
  whitelist: ['authenticated', 'user', 'wasOnboardingShown'],
};

const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  [wordleAIApi.reducerPath]: wordleAIApi.reducer,
  user: persistReducer(sessionPersistConfig, userReducer),
});

export default rootReducer;
