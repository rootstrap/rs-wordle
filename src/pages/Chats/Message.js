import useAuth from 'hooks/useAuth';

const Message = ({
  message: {
    message,
    user: { name, photo, uid },
  },
}) => {
  const {
    user: { uid: currentUserUId },
  } = useAuth();

  return (
    <div className={`chat-bubble ${uid === currentUserUId ? 'right' : ''}`}>
      <img className="chat-bubble__left" src={photo} alt="user avatar" />
      <div>
        <p className="user-name">{name}</p>
        <p className="user-message">{message}</p>
      </div>
    </div>
  );
};

export default Message;
