import { useState } from 'react';
import { IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

import Input from 'components/common/Input';

import Comment from './Comment';
import './styles.css';

const Comments = ({ suggestion, comments, addComment, selectedComment, changeSelectedComment }) => {
  const [newComment, setNewComment] = useState('');

  const handleAddComment = async () => {
    await addComment(suggestion, newComment);
    setNewComment('');
  };

  return (
    <div className="comments-container">
      <div className="add-comment-container">
        <Input value={newComment} handleOnChange={setNewComment} rows={4} />
        <div className="send-icon">
          <IconButton onClick={handleAddComment} disabled={!newComment}>
            <SendIcon htmlColor="white" />
          </IconButton>
        </div>
      </div>
      {comments.map(comment => (
        <Comment
          key={`${comment.id}`}
          comment={comment}
          selectedComment={selectedComment}
          changeSelectedComment={changeSelectedComment}
        />
      ))}
    </div>
  );
};

export default Comments;
