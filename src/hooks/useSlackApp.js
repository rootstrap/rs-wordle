import { useMemo } from 'react';
import axios from 'axios';

const SLACK_TOKEN = process.env.REACT_APP_SLACK_TOKEN;
const CHANNEL_ID = process.env.REACT_APP_WORDLE_CHANNEL_ID;
const TEST_CHANNEL_ID = process.env.REACT_APP_WORDLE_TEST_CHANNEL_ID;
const USE_TEST_CHANNEL = process.env.REACT_APP_USE_TEST_CHANNEL;

const useSlackApp = () => {
  const channelId = useMemo(
    () => (USE_TEST_CHANNEL === 'false' ? CHANNEL_ID : TEST_CHANNEL_ID),
    []
  );

  /*
    The ID is always the same. I use this to get the id and I leave it in case the
    channel changes, but right now is unnecesary to call it every time since
    the id doesnt change and I already know it (C02U49H0VJA) 
  */
  // eslint-disable-next-line no-unused-vars
  const findConversation = async channelName => {
    try {
      const EXCLUDE_ARCHIVED = true;
      const LIMIT = 700;
      const body = `token=${SLACK_TOKEN}&exclude_archived=${EXCLUDE_ARCHIVED}&limit=${LIMIT}`;
      const { data } = await axios.post('https://slack.com/api/conversations.list', body);

      const { id: channelId } = data?.channels?.find(({ name }) => name === channelName) || {};
      console.log('channelId: ', channelId);
    } catch (error) {
      console.error(error);
    }
  };

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
