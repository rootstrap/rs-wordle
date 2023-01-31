import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';

import Input from 'components/common/Input';

import Comment from './Comment';
import './styles.css';

const Comments = ({
  suggestion,
  comments,
  addComment,
  selectedComment,
  changeSelectedComment,
  updateComment,
  deleteComment,
}) => {
  const [newComment, setNewComment] = useState('');

  const handleAddComment = async () => {
    await addComment(suggestion, newComment);
    setNewComment('');
  };

  const handleUpdateComment = () => updateComment(suggestion);

  const handleDeleteComment = commentId => deleteComment(suggestion, commentId);

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
          handleUpdateComment={handleUpdateComment}
          handleDeleteComment={handleDeleteComment}
        />
      ))}
    </div>
  );
};

export default Comments;
