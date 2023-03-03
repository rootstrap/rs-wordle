import { createReducer } from '@rootstrap/redux-tools';

import { setAllTimeRanking, setTodaysResults } from 'state/actions/rankingActions';

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

export default createReducer(initialState, {
  [setAllTimeRanking]: handleSetAllTimeRanking,
  [setTodaysResults]: handleSetTodaysResults,
});
