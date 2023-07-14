import { createReducer } from '@rootstrap/redux-tools';

import { setUserStatistics } from 'state/actions/statisticsActions';
import { logout } from 'state/actions/userActions';

const initialState = {
  statistics: {},
};

const handleSetUsersStatistics = (state, { payload: { statistics, selectedUser } }) => {
  state.statistics = { ...state.statistics, [selectedUser]: statistics };
};

const handleLogout = () => {
  return initialState;
};

export default createReducer(initialState, {
  [logout]: handleLogout,
  [setUserStatistics]: handleSetUsersStatistics,
});
