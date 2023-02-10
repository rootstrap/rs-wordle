import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toPairs } from 'lodash';

import { MAX_ATTEMPTS } from 'constants/constants';
import { getUsersStatistics, updateUsersStatistics } from 'firebase/usersStatistics';
import { setUserStatistics } from 'state/actions/statisticsActions';

import useAuth from './useAuth';

const useUserStatistics = ({ email, name, photo } = {}) => {
  const dispatch = useDispatch();

  const {
    user: { email: currentUser, photo: currentUserPhoto },
  } = useAuth();

  const selectedUser = email ?? currentUser;
  const userName = name ? `${name.split(' ')[0]}'s` : 'My ';
  const profilePhoto = photo ?? currentUserPhoto;

  const { statistics } = useSelector(({ statistics: { statistics = {} } }) => ({
    statistics: statistics[selectedUser] ?? {},
  }));

  useEffect(() => {
    const getStatistics = async () => {
      const { currentStatistics } = await getUsersStatistics(selectedUser);
      await dispatch(setUserStatistics({ statistics: currentStatistics, selectedUser }));
    };

    if (Object.keys(statistics).length === 0) {
      getStatistics();
    }
  }, [selectedUser, dispatch, statistics]);

  const updateStatistics = async newStatistics => {
    await updateUsersStatistics(newStatistics, selectedUser);
    await dispatch(setUserStatistics({ statistics: newStatistics, selectedUser }));
  };

  const maxAttemptsRound = useMemo(
    () => Math.max(...(statistics.totalAttempts ?? [])),
    [statistics.totalAttempts]
  );

  const topAttemptedWords = useMemo(() => {
    const attemptedWordsArray = toPairs(statistics.attemptedWords).sort((a, b) => b[1] - a[1]);
    return attemptedWordsArray.slice(0, MAX_ATTEMPTS + 1);
  }, [statistics.attemptedWords]);

  const maxAttemptedWords = !!topAttemptedWords?.length ? topAttemptedWords[0][1] : 0;

  return {
    statistics,
    updateStatistics,
    maxAttemptsRound,
    maxAttemptedWords,
    topAttemptedWords,
    profilePhoto,
    userName,
  };
};

export default useUserStatistics;
