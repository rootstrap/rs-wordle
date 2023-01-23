import { useEffect, useState } from 'react';
import axios from 'axios';

const SLACK_TOKEN = 'xoxb-3733938923-4680524309076-UJlHUhu0j9PZ2JKWGmqscnXc';
const EXCLUDE_ARCHIVED = true;
const LIMIT = 700;

const useSlackApp = () => {
  // wordle channelId = C02U49H0VJA
  // test-wordle channelId = C04KRFK4VJA
  const [channelId, setChannelId] = useState('C04KRFK4VJA');
  const [callFindConversation] = useState(false);

  const findConversation = async channelName => {
    try {
      const body = `token=${SLACK_TOKEN}&exclude_archived=${EXCLUDE_ARCHIVED}&limit=${LIMIT}`;
      const { data } = await axios.post('https://slack.com/api/conversations.list', body);

      const { id: channelId } = data?.channels?.find(({ name }) => name === channelName) || {};
      setChannelId(channelId);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    /*
     The ID is always the same. I use this to get the id and I leave it in case the
     channel changes, but right now is unnecesary to call it every time since
     the id doesnt change and I already know it (C02U49H0VJA) */
    callFindConversation && findConversation('wordle');
  }, [callFindConversation]);

  const sendMessageToChannel = async message => {
    try {
      const body = `token=${SLACK_TOKEN}&channel=${channelId}&text=${message}`;
      await axios.post('https://slack.com/api/chat.postMessage', body);
    } catch (error) {
      console.error(error);
    }
  };

  return { sendMessageToChannel };
};

export default useSlackApp;
