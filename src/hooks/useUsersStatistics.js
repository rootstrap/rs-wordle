import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { toPairs } from 'lodash';

import { MAX_ATTEMPTS } from 'constants/constants';
import { USERS_STATISTICS } from 'firebase/collections';
import firebaseData from 'firebase/firebase';
import { setUserStatistics } from 'state/actions/statisticsActions';

import useAuth from './useAuth';

const { firebaseDb } = firebaseData;
const statisticsRef = collection(firebaseDb, USERS_STATISTICS);

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
      try {
        let currentStatistics = {
          totalGames: 0,
          totalWins: 0,
          totalAttempts: Array(MAX_ATTEMPTS + 1).fill(0),
          currentStreak: 0,
          lastDatePlayed: '',
          longestStreak: 0,
          longestStreakDate: '',
          attemptedWords: {},
          timeAverage: 0,
          minTime: 0,
          maxTime: 0,
        };
        const docRef = doc(firebaseDb, USERS_STATISTICS, selectedUser);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          currentStatistics = docSnap.data();
        } else {
          await setDoc(doc(statisticsRef, selectedUser), currentStatistics);
        }
        await dispatch(setUserStatistics({ statistics: currentStatistics, selectedUser }));
      } catch (err) {
        console.error(err);
      }
    };

    if (Object.keys(statistics).length === 0) {
      getStatistics();
    }
  }, [selectedUser, dispatch, statistics]);

  const updateStatistics = async newStatistics => {
    await updateDoc(doc(statisticsRef, selectedUser), newStatistics);
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
