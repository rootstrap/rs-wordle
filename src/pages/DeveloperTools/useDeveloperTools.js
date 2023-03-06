import { useState } from 'react';

import useErrorHandling from 'components/common/RSWordleErrorBoundary/useErrorHandling';
import { MAX_ATTEMPTS } from 'constants/constants';
import { getAllUsersDailyResults } from 'firebase/dailyResults';
import { getUsersStatistics, updateUsersStatistics } from 'firebase/usersStatistics';
import useUsers from 'hooks/useUsers';
import { GAME_STATUS } from 'constants/types';
import { getDisplayDate } from 'utils/helpers';

const EMPTY_STATISTICS = {
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

const useDeveloperTools = () => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [statisticsCheck, setStatisticsCheck] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { usersList } = useUsers();

  const { triggerError } = useErrorHandling();

  const toggleSelectedUser = user => {
    const isSelectedUser = !!selectedUsers.find(email => email === user);

    setSelectedUsers(previous => {
      if (isSelectedUser) {
        return previous.filter(email => email !== user);
      }

      const newSelectedUsers = [...previous];
      newSelectedUsers.push(user);
      return newSelectedUsers;
    });
  };

  const processResults = ({
    currentStatistics: {
      totalGames,
      totalWins,
      totalAttempts,
      currentStreak,
      longestStreak,
      attemptedWords,
      longestStreakDate,
      timeAverage,
      minTime,
      maxTime,
    },
    attemptedWords: usersAttempts,
    attempts,
    date,
    solveTime,
    status,
  }) => {
    const won = status === GAME_STATUS.won;
    const totalAttemptsIndex = won ? attempts - 1 : MAX_ATTEMPTS;
    const newCurrentStreak = won ? currentStreak + 1 : 0;
    const newTotalAttempts = [...totalAttempts];
    newTotalAttempts[totalAttemptsIndex] = totalAttempts[totalAttemptsIndex] + 1;
    const newAttemptedWords = { ...attemptedWords };
    usersAttempts.forEach(({ word }) => {
      const currentValue = newAttemptedWords[word] ?? 0;
      newAttemptedWords[word] = currentValue + 1;
    });
    const year = Number(date.substring(0, 4));
    const month = Number(date.substring(4, 6));
    const monthIndex = month - 1;
    const day = Number(date.substring(6, 8));
    const lastDatePlayed = getDisplayDate(new Date(year, monthIndex, day));

    const newStatistics = {
      totalGames: totalGames + 1,
      totalWins: won ? totalWins + 1 : totalWins,
      totalAttempts: newTotalAttempts,
      currentStreak: newCurrentStreak,
      longestStreak: newCurrentStreak > longestStreak ? newCurrentStreak : longestStreak,
      attemptedWords: newAttemptedWords,
      lastDatePlayed,
      longestStreakDate: newCurrentStreak >= longestStreak ? lastDatePlayed : longestStreakDate,
      timeAverage: Math.round((timeAverage * totalGames + solveTime) / (totalGames + 1)),
      minTime: solveTime < minTime ? solveTime : minTime,
      maxTime: solveTime > maxTime ? solveTime : maxTime,
    };

    return newStatistics;
  };

  const compareStatistics = async () => {
    setIsLoading(true);
    if (!selectedUsers.length) {
      alert('No Users Selected');
    }

    const newStatisticsCheck = [];

    await Promise.all(
      selectedUsers.map(async email => {
        let expectedStatistics = EMPTY_STATISTICS;

        const { currentStatistics } = await getUsersStatistics(email, triggerError);
        const { docs } = await getAllUsersDailyResults(email, triggerError);

        docs.forEach(doc => {
          const { status, ...restOfData } = doc.data();
          if (status !== GAME_STATUS.playing) {
            expectedStatistics = processResults({
              currentStatistics: expectedStatistics,
              status,
              ...restOfData,
            });
          }
        });

        const objectDiff = (obj1, obj2) =>
          Object.fromEntries(
            Object.entries(obj1).filter(([key, value]) => {
              if (typeof value === 'object') {
                const objectComp = objectDiff(value, obj2[key]);
                const isDifferentValue = Object.keys(objectComp).length > 0;
                return isDifferentValue;
              }
              return value !== obj2[key];
            })
          );

        const statisticsDifference = objectDiff(expectedStatistics, currentStatistics);

        const isDifferent = Object.keys(statisticsDifference).length > 0;

        const errorConsoleLog = () => {
          console.warn(email);
          console.log('statisticsDifference (expected): ', statisticsDifference);
          Object.entries(statisticsDifference).forEach(([key, value]) => {
            if (typeof value === 'object') {
              console.log(`${key}:`);
              console.log('expected ', value);
              console.log('found ', currentStatistics[key]);
            } else {
              console.log(`${key}: expected ${value} -> found ${currentStatistics[key]}`);
            }
          });
        };

        if (isDifferent) {
          errorConsoleLog();
        }

        newStatisticsCheck.push({
          color: isDifferent ? '#d23e3e' : '#538d4e',
          message: `${email} -> ${isDifferent ? '❌' : '✅'}`,
          handleClickLink: isDifferent
            ? async () => {
                errorConsoleLog();
                if (
                  window.confirm(
                    `Are you sure you want to update statistics for ${email}? Please check the console log to make sure of the changes you are going to make`
                  )
                )
                  await updateUsersStatistics(expectedStatistics, email, triggerError);
              }
            : undefined,
        });
      })
    );

    setStatisticsCheck(newStatisticsCheck);
    setIsLoading(false);
  };

  const clearStatisticsCheck = () => setStatisticsCheck([]);
  const clearSelectedUsers = () => setSelectedUsers([]);

  const selectAllUsers = () => {
    const newSelectedUsers = [...usersList];
    setSelectedUsers(newSelectedUsers.map(({ email }) => email));
  };

  return {
    statisticsCheck,
    isLoading,
    selectedUsers,
    usersList,
    toggleSelectedUser,
    compareStatistics,
    clearStatisticsCheck,
    clearSelectedUsers,
    selectAllUsers,
  };
};

export default useDeveloperTools;
