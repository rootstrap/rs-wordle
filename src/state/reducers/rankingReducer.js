import { createReducer } from '@rootstrap/redux-tools';

import { setAllTimeRanking, setTodaysResults } from 'state/actions/rankingActions';
import { logout } from 'state/actions/userActions';

const initialState = {
  dailyResults: [],
  rankingData: [],
};

const handleSetAllTimeRanking = (state, { payload: { allTimeRankingData } }) => {
  state.rankingData = allTimeRankingData;
};

const handleSetTodaysResults = (state, { payload: { todaysResults } }) => {
  state.dailyResults = todaysResults;
};

const handleLogout = () => {
  return initialState;
};

export default createReducer(initialState, {
  [logout]: handleLogout,
  [setAllTimeRanking]: handleSetAllTimeRanking,
  [setTodaysResults]: handleSetTodaysResults,
});
