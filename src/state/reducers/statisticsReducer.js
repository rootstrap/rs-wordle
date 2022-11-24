import { createReducer } from '@rootstrap/redux-tools';

import { setUserStatistics } from 'state/actions/statisticsActions';

const initialState = {
  statistics: {},
};

const handleSetUsersStatistics = (state, { payload: { statistics } }) => {
  state.statistics = statistics;
};

export default createReducer(initialState, {
  [setUserStatistics]: handleSetUsersStatistics,
});
