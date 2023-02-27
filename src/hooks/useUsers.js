import { useCallback, useEffect, useState } from 'react';

import { getUsers } from 'firebase/users';

const useUsers = () => {
  const [filters, setFilters] = useState({ username: '' });
  const [usersList, setUsersList] = useState();

  const { username } = filters;

  const getUsersList = useCallback(async () => {
    try {
      const { users } = await getUsers({ username });
      setUsersList(users);
    } catch (err) {
      console.log('err: ', err);
    }
  }, [username]);

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
