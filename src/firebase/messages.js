import {
  addDoc,
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';

import { MESSAGES } from 'firebase/collections';
import firebaseData from 'firebase/firebase';

const { firebaseDb } = firebaseData;
const messagesRef = collection(firebaseDb, MESSAGES);

export const addMessage = ({ message, user }) => {
  addDoc(messagesRef, {
    message,
    user,
    createdAt: serverTimestamp(),
  });
};

export const getMessage = ({ setMessages }) => {
  const q = query(messagesRef, orderBy('createdAt'), limit(50));
  const unsubscribe = onSnapshot(q, QuerySnapshot => {
    let messages = [];
    QuerySnapshot.forEach(doc => {
      messages.push({ ...doc.data(), id: doc.id });
    });
    setMessages(messages);
  });

  return { unsubscribe };
};
