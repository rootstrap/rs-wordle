import { createReducer } from '@rootstrap/redux-tools';

import { setAllTimeRanking, setTodaysResults, setUsersObject } from 'state/actions/rankingActions';

const initialState = {
  dailyResults: [],
  rankingData: [],
  users: {},
};

const handleSetAllTimeRanking = (state, { payload: { allTimeRankingData } }) => {
  state.rankingData = allTimeRankingData;
};

const handleSetTodaysResults = (state, { payload: { todaysResults } }) => {
  state.dailyResults = todaysResults;
};

const handleSetUsersObject = (state, { payload: { users } }) => {
  state.users = users;
};

export default createReducer(initialState, {
  [setAllTimeRanking]: handleSetAllTimeRanking,
  [setTodaysResults]: handleSetTodaysResults,
  [setUsersObject]: handleSetUsersObject,
});
