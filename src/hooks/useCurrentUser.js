import { useEffect, useState } from 'react';

import { disableUsersBan, getUserInfo } from 'firebase/users';
import { getTimeDiff, getTodaysDate } from 'utils/helpers';

import useAuth from './useAuth';

const useCurrentUser = () => {
  const {
    user: { email },
  } = useAuth();

  const [currentUserInfo, setCurrentUserInfo] = useState({});

  const { bannedDays, bannedStartDate, isBanned, timeRemaining } = currentUserInfo;

  useEffect(() => {
    (async function () {
      const { userInfo } = await getUserInfo(email);
      const { bannedDays, bannedStartDate, isBanned } = userInfo;

      if (isBanned) {
        const today = getTodaysDate(false);
        const startDate = new Date(bannedStartDate);
        const daysDiff = getTimeDiff(startDate, today, 'days');

        userInfo.timeRemaining = daysDiff;

        if (daysDiff >= bannedDays) {
          await disableUsersBan(email);
          userInfo.isBanned = false;
        }
      }
      setCurrentUserInfo(userInfo);
    })();
  }, [email]);

  return {
    bannedDays,
    bannedStartDate,
    isBanned,
    timeRemaining,
  };
};

export default useCurrentUser;
