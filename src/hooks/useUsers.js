import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

import { USERS } from 'firebase/collections';
import firebaseData from 'firebase/firebase';

const { firebaseDb } = firebaseData;

const useUsers = () => {
  const [filters, setFilters] = useState({ username: '' });
  const [usersList, setUsersList] = useState();

  const { username } = filters;

  useEffect(() => {
    (async function () {
      if (!usersList) {
        try {
          const q = query(collection(firebaseDb, USERS), orderBy('name'));
          const docs = await getDocs(q);
          const newUsersList = [];
          docs.forEach(doc => {
            const { name, photo } = doc.data();
            if (name.toUpperCase().includes(username.toUpperCase())) {
              newUsersList.push({ name, photo });
            }
          });
          setUsersList(newUsersList);
        } catch (err) {
          console.log('err: ', err);
        }
      }
    })();
  }, [username, usersList]);

  return {
    setFilters,
    usersList,
  };
};

export default useUsers;
