import useMessages from 'hooks/useMessages';

import Message from './Message';
import SendMessage from './SendMessage';
import './styles.css';

const Chats = () => {
  const { handleSendMessage, handleSetMessage, message, messages, scrollRef } = useMessages();

  return (
    <main className="chat-box">
      <div className="messages-wrapper">
        {messages?.map(message => (
          <Message key={message.id} message={message} />
        ))}
      </div>
      <span ref={scrollRef} />
      <SendMessage
        message={message}
        handleSetMessage={handleSetMessage}
        handleSendMessage={handleSendMessage}
      />
    </main>
  );
};

export default Chats;
