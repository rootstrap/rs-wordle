import { useEffect, useMemo, useState, useCallback } from 'react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  updateDoc,
  where,
} from 'firebase/firestore';

import { MODAL_TYPE, SUGGESTIONS_STATUS } from 'constants/types';
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
      comments: [],
      createdDate: today,
      description: '',
      id: '',
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
  const [selectedComment, setSelectedComment] = useState();

  const {
    statusFilter: { value: statusFilterValue },
  } = filters;
  const { title, description } = useMemo(() => newSuggestion, [newSuggestion]);

  const getDataFromSuggestion = ({
    suggestion: {
      comments,
      createdDate,
      description,
      id,
      negativeVotes,
      positiveVotes,
      status,
      title,
      voteCount,
    },
  }) => ({
    comments,
    createdDate,
    description,
    id,
    negativeVotes,
    positiveVotes,
    status,
    title,
    voteCount,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState(MODAL_TYPE.add);
  const handleOpenModal = (mode = MODAL_TYPE.add, suggestion = EMPTY_SUGGESTION) => {
    setIsModalOpen(true);
    setModalMode(mode);
    setNewSuggestion(getDataFromSuggestion({ suggestion }));
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setErrors(EMPTY_ERRORS);
    setNewSuggestion(EMPTY_SUGGESTION);
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
        isMySuggestion: suggestedBy.id === myId,
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
        id: doc.id,
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
    setErrors(EMPTY_ERRORS);
  };

  const onChangeErrors = (key, newValue) => handleOnChangeState(setErrors, key, newValue);

  const addEditNewSuggestion = async () => {
    if (!title) {
      onChangeErrors('title', t('errors.emptyTitle'));
      return;
    }
    if (!description) {
      onChangeErrors('description', t('errors.emptyDescription'));
      return;
    }

    setIsLoading(true);
    const isEdit = modalMode === MODAL_TYPE.edit;

    console.log('newSuggestion: ', newSuggestion);

    try {
      if (isEdit) {
        await updateDoc(doc(suggestionsRef, newSuggestion.id), newSuggestion);
      } else {
        await addDoc(suggestionsRef, newSuggestion);
      }

      await getSuggestions();

      handleCloseModal();
    } catch (err) {
      // TODO: handle errors
      console.error(err);
    }
    setIsLoading(false);
  };

  const deleteSuggestion = async id => {
    try {
      await deleteDoc(doc(suggestionsRef, id));
    } catch (err) {
      // TODO: handle errors
      console.error(err);
      return false;
    }

    await getSuggestions();

    return true;
  };

  const filterCurrentUser = votes => votes.filter(({ id }) => id !== myId);

  const voteSuggestion = async (suggestion, isPositive) => {
    const { votedNegative, votedPositive } = suggestion;
    const currentSuggestion = getDataFromSuggestion({ suggestion });

    if (isPositive) {
      currentSuggestion.negativeVotes = filterCurrentUser(currentSuggestion.negativeVotes);
      if (votedPositive) {
        currentSuggestion.positiveVotes = filterCurrentUser(currentSuggestion.positiveVotes);
      } else {
        currentSuggestion.positiveVotes.push({
          email,
          id: myId,
          name,
          photo,
        });
      }
    } else {
      currentSuggestion.positiveVotes = filterCurrentUser(currentSuggestion.positiveVotes);
      if (votedNegative) {
        currentSuggestion.negativeVotes = filterCurrentUser(currentSuggestion.negativeVotes);
      } else {
        currentSuggestion.negativeVotes.push({
          email,
          id: myId,
          name,
          photo,
        });
      }
    }

    try {
      await updateDoc(doc(suggestionsRef, currentSuggestion.id), currentSuggestion);
    } catch (err) {
      // TODO: handle errors
      console.error(err);
    }

    await getSuggestions();
  };

  const addComment = async (suggestion, newComment) => {
    const newComments = [...suggestion.comments];
    newComments.unshift({
      id: Date.now(),
      text: newComment,
      user: {
        email,
        name,
        photo,
        id: myId,
      },
    });
    const newSuggestion = { ...suggestion, comments: newComments };

    try {
      await updateDoc(doc(suggestionsRef, newSuggestion.id), newSuggestion);
      await getSuggestions();
    } catch (err) {
      // TODO: handle errors
      console.error(err);
    }
  };

  const changeSelectedComment = comment => setSelectedComment(comment);

  return {
    filters,
    onChangeFilter,
    suggestions,
    newSuggestion,
    onChangeNewSuggestion,
    addEditNewSuggestion,
    deleteSuggestion,
    voteSuggestion,
    isModalOpen,
    modalMode,
    handleOpenModal,
    handleCloseModal,
    errors,
    isLoading,
    addComment,
    selectedComment,
    changeSelectedComment,
  };
};

export default useSuggestions;
