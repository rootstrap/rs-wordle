import { useEffect, useMemo, useState, useCallback } from 'react';
import { addDoc, collection, getDocs, query, orderBy, where } from 'firebase/firestore';

import { SUGGESTIONS_STATUS } from 'constants/types';
import { SUGGESTIONS } from 'firebase/collections';
import firebaseData from 'firebase/firebase';
import useAuth from 'hooks/useAuth';
import useTranslation from 'hooks/useTranslation';
import { getTodaysDate, handleOnChangeState } from 'utils/helpers';

const { firebaseDb } = firebaseData;
const suggestionsRef = collection(firebaseDb, SUGGESTIONS);

const EMPTY_ERRORS = {
  title: '',
  description: '',
};

const useSuggestions = () => {
  const t = useTranslation();
  const today = getTodaysDate();

  const DEFAULT_STATUS = useMemo(() => SUGGESTIONS_STATUS.find(({ isDefault }) => isDefault), []);

  const {
    user: { email, name, photo, uid: myId },
  } = useAuth();

  const EMPTY_SUGGESTION = useMemo(
    () => ({
      createdDate: today,
      description: '',
      negativeVotes: [],
      positiveVotes: [
        {
          email,
          id: myId,
          name,
          photo,
        },
      ],
      status: 'Pending',
      title: '',
      voteCount: 1,
    }),
    [email, myId, name, photo, today]
  );

  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [errors, setErrors] = useState(EMPTY_ERRORS);
  const [newSuggestion, setNewSuggestion] = useState(EMPTY_SUGGESTION);
  const [filters, setFilters] = useState({ statusFilter: DEFAULT_STATUS });

  const {
    statusFilter: { value: statusFilterValue },
  } = filters;
  const { title, description } = useMemo(() => newSuggestion, [newSuggestion]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setErrors(EMPTY_SUGGESTION);
  };

  const getSuggestions = useCallback(async () => {
    let q;
    if (statusFilterValue === 'All') {
      q = query(
        suggestionsRef,
        orderBy('createdDate', 'desc'),
        orderBy('status', 'desc'),
        orderBy('voteCount', 'desc')
      );
    } else {
      q = query(
        suggestionsRef,
        where('status', '==', statusFilterValue),
        orderBy('createdDate', 'desc'),
        orderBy('voteCount', 'desc')
      );
    }
    const docs = await getDocs(q);

    const results = [];
    docs.forEach(doc => {
      const { description, negativeVotes, positiveVotes, status, title, ...restSuggestionsProps } =
        doc.data();
      const negativeVotesCount = negativeVotes.length;
      const positiveVotesCount = positiveVotes.length;
      const statusColor =
        SUGGESTIONS_STATUS.find(({ value }) => value === status)?.color || 'black';
      const suggestedBy = positiveVotes[0];
      const votedNegative = negativeVotes.some(({ id }) => id === myId);
      const votedPositive = positiveVotes.some(({ id }) => id === myId);

      results.push({
        description,
        id: doc.id,
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
  }, [myId, statusFilterValue]);

  useEffect(() => {
    getSuggestions();
  }, [getSuggestions]);

  const onChangeFilter = (key, newValue) => handleOnChangeState(setFilters, key, newValue);

  const onChangeNewSuggestion = (key, newValue) => {
    handleOnChangeState(setNewSuggestion, key, newValue);
    setErrors(EMPTY_SUGGESTION);
  };

  const onChangeErrors = (key, newValue) => handleOnChangeState(setErrors, key, newValue);

  const addNewSuggestion = async () => {
    if (!title) {
      onChangeErrors('title', t('errors.emptyTitle'));
      return;
    }
    if (!description) {
      onChangeErrors('description', t('errors.emptyDescription'));
      return;
    }

    setIsLoading(true);

    try {
      await addDoc(suggestionsRef, newSuggestion);
      await getSuggestions();
      setNewSuggestion(EMPTY_SUGGESTION);
      setErrors(EMPTY_ERRORS);
      handleCloseModal();
    } catch (err) {
      // TODO: handle errors
      console.error(err);
    }
    setIsLoading(false);
  };

  return {
    filters,
    onChangeFilter,
    suggestions,
    newSuggestion,
    onChangeNewSuggestion,
    addNewSuggestion,
    isModalOpen,
    handleOpenModal,
    handleCloseModal,
    errors,
    isLoading,
  };
};

export default useSuggestions;
