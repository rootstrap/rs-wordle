import { useEffect, useRef, useState } from 'react';

import { addMessage, getMessage } from 'firebase/messages';
import useAuth from 'hooks/useAuth';

const useMessages = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const { user } = useAuth();

  const scrollRef = useRef();

  const scrollToBottom = async () => {
    scrollRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const { unsubscribe } = getMessage({ setMessages });
    return () => unsubscribe;
  }, []);

  useEffect(() => {
    if (!!messages.length) {
      scrollToBottom();
    }
  }, [messages.length]);

  const handleSetMessage = newMessage => setMessage(newMessage);

  const handleSendMessage = async () => {
    if (message.trim() === '') {
      alert('Enter valid message');
      return;
    }
    await addMessage({ message, user });
    setMessage('');
  };

  return {
    message,
    messages,
    handleSetMessage,
    handleSendMessage,
    scrollRef,
  };
};

export default useMessages;
