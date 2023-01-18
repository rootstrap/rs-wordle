import { useEffect, useMemo, useState } from 'react';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';

import { SUGGESTIONS_STATUS } from 'constants/types';
import { SUGGESTIONS } from 'firebase/collections';
import firebaseData from 'firebase/firebase';
import useAuth from 'hooks/useAuth';

const { firebaseDb } = firebaseData;

const useSuggestions = () => {
  const DEFAULT_STATUS = useMemo(
    () => SUGGESTIONS_STATUS.filter(({ isDefault }) => isDefault)[0],
    []
  );
  const [suggestions, setSuggestions] = useState([]);
  const [filters, setFilters] = useState({ statusFilter: DEFAULT_STATUS });

  const {
    statusFilter: { value: statusFilterValue },
  } = filters;

  const {
    user: { uid: myId },
  } = useAuth();

  useEffect(() => {
    (async function () {
      let q;
      if (statusFilterValue === 'All') {
        q = query(
          collection(firebaseDb, SUGGESTIONS),
          orderBy('voteCount', 'desc'),
          orderBy('status', 'desc'),
          orderBy('createdDate', 'desc')
        );
      } else {
        q = query(
          collection(firebaseDb, SUGGESTIONS),
          where('status', '==', statusFilterValue),
          orderBy('voteCount', 'desc'),
          orderBy('createdDate', 'desc')
        );
      }
      const docs = await getDocs(q);

      const results = [];
      docs.forEach(doc => {
        const {
          description,
          negativeVotes,
          positiveVotes,
          status,
          title,
          ...restSuggestionsProps
        } = doc.data();
        const negativeVotesCount = negativeVotes.length;
        const positiveVotesCount = positiveVotes.length;
        const statusColor =
          SUGGESTIONS_STATUS.find(({ value }) => value === status)?.color || 'black';
        const suggestedBy = positiveVotes[0];
        const votedNegative = !!negativeVotes.find(({ id }) => id === myId);
        const votedPositive = !!positiveVotes.find(({ id }) => id === myId);

        results.push({
          description,
          negativeVotes,
          negativeVotesCount,
          positiveVotes,
          positiveVotesCount,
          status,
          statusColor,
          suggestedBy,
          title,
          votedNegative,
          votedPositive,
          ...restSuggestionsProps,
        });
      });
      setSuggestions(results);
    })();
  }, [myId, statusFilterValue]);

  const onChangeStatusFilter = newFilter =>
    setFilters(oldFilters => ({
      ...oldFilters,
      statusFilter: newFilter,
    }));

  return {
    filters,
    onChangeStatusFilter,
    suggestions,
  };
};

export default useSuggestions;
