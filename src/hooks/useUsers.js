import { useCallback, useEffect, useState } from 'react';

import useErrorHandling from 'components/common/RSWordleErrorBoundary/useErrorHandling';
import { getUsers } from 'firebase/users';

const useUsers = () => {
  const [filters, setFilters] = useState({ username: '' });
  const [usersList, setUsersList] = useState();

  const { username } = filters;
  const { triggerError } = useErrorHandling();

  const getUsersList = useCallback(async () => {
    const { users } = await getUsers({ username, triggerError });
    setUsersList(users);
  }, [triggerError, username]);

  const changeFilter = async (key, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [key]: value,
    }));
    getUsersList();
  };

  useEffect(() => {
    getUsersList();
  }, [getUsersList]);

  return {
    filters,
    changeFilter,
    usersList,
  };
};

export default useUsers;
