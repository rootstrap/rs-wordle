import { combineReducers } from 'redux';

import { api } from 'services/api';
import userReducer from './userReducer';

const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  user: userReducer,
});

export default rootReducer;
