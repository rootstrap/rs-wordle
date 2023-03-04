import React from 'react';

import Button from 'components/common/Button';
import useTranslation from 'hooks/useTranslation';

const SendMessage = ({ message, handleSetMessage, handleSendMessage }) => {
  const t = useTranslation();

  return (
    <form className="send-message">
      <label htmlFor="messageInput" hidden>
        {t('chats.inputLabel')}
      </label>
      <input
        id="messageInput"
        name="messageInput"
        type="text"
        className="form-input__input"
        placeholder={t('chats.placeholder')}
        value={message}
        onChange={({ target: { value } }) => handleSetMessage(value)}
      />
      <Button handleClick={handleSendMessage} disabled={!message}>
        {t('chats.send')}
      </Button>
    </form>
  );
};

export default SendMessage;
