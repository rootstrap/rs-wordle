import { useCallback, useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

import { USERS } from 'firebase/collections';
import firebaseData from 'firebase/firebase';

const { firebaseDb } = firebaseData;

const useUsers = () => {
  const [filters, setFilters] = useState({ username: '' });
  const [usersList, setUsersList] = useState();

  const { username } = filters;

  const getUsers = useCallback(async () => {
    try {
      const q = query(collection(firebaseDb, USERS), orderBy('name'));
      const docs = await getDocs(q);
      const newUsersList = [];
      docs.forEach(doc => {
        const { email, name, photo, uid } = doc.data();
        if (name.toUpperCase().includes(username.toUpperCase())) {
          newUsersList.push({ email, name, photo, id: uid });
        }
      });
      setUsersList(newUsersList);
    } catch (err) {
      console.log('err: ', err);
    }
  }, [username]);

  const changeFilter = async (key, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [key]: value,
    }));
    getUsers();
  };

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  return {
    filters,
    changeFilter,
    usersList,
  };
};

export default useUsers;
