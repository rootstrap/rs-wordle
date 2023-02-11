import React from 'react';

import Button from 'components/common/Button';

const SendMessage = ({ message, handleSetMessage, handleSendMessage }) => {
  return (
    <form className="send-message">
      <label htmlFor="messageInput" hidden>
        Enter Message
      </label>
      <input
        id="messageInput"
        name="messageInput"
        type="text"
        className="form-input__input"
        placeholder="type message..."
        value={message}
        onChange={({ target: { value } }) => handleSetMessage(value)}
      />
      <Button handleClick={handleSendMessage}>Send</Button>
    </form>
  );
};

export default SendMessage;
