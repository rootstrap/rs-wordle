import { combineReducers } from 'redux';

import { api } from 'services/api';

import statisticsReducer from './statisticsReducer';
import userReducer from './userReducer';

const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  statistics: statisticsReducer,
  user: userReducer,
});

export default rootReducer;
