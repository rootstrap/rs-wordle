import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';

import Input from 'components/common/Input';
import { TEXT_COLOR } from 'constants/constants';
import useTranslation from 'hooks/useTranslation';

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

  const t = useTranslation();

  const handleAddComment = async () => {
    await addComment(suggestion, newComment);
    setNewComment('');
  };

  const handleUpdateComment = () => updateComment(suggestion);

  const handleDeleteComment = commentId => deleteComment(suggestion, commentId);

  return (
    <div className="comments-container">
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
      <div className="add-comment-container" role="group" aria-label={t('comments.addNewComment')}>
        <Input
          value={newComment}
          handleOnChange={setNewComment}
          rows={4}
          aria-label={t('comments.commentText')}
        />
        <div className="send-icon">
          <IconButton
            onClick={handleAddComment}
            disabled={!newComment}
            aria-label={t('comments.addComment')}
          >
            <SendIcon htmlColor={TEXT_COLOR} />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default Comments;
