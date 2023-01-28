import {
  Cancel as CancelIcon,
  CheckCircle as SaveIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { IconButton } from '@mui/material';

import Input from 'components/common/Input';
import { VOTED_COLOR } from 'constants/constants';
import useAuth from 'hooks/useAuth';
import useTranslation from 'hooks/useTranslation';

import './styles.css';

const Comment = ({
  comment: {
    id,
    text,
    user: { id: userId, name, photo },
  },
  comment,
  selectedComment,
  changeSelectedComment,
  handleUpdateComment,
}) => {
  const t = useTranslation();
  const {
    user: { uid },
  } = useAuth();

  const isSelected = id === selectedComment?.id;
  const isMyComment = userId === uid;
  const showEditDeleteIcons = isMyComment && !isSelected;
  const showCancelSaveIcons = isMyComment && isSelected;

  const enableEditComment = () => changeSelectedComment(comment);
  const stopEditingComment = () => changeSelectedComment();
  const handleEditCommentText = newValue => {
    const newComment = { ...comment, text: newValue };
    changeSelectedComment(newComment);
  };
  const onEditComment = async () => {
    await handleUpdateComment();
    stopEditingComment();
  };

  return (
    <div className="comment-container">
      <div className="row-container">
        <div className="comment-text-container">
          {isSelected ? (
            <Input
              value={selectedComment?.text}
              handleOnChange={handleEditCommentText}
              rows={4}
              extraClassNames={['edit-comment-text-area']}
            />
          ) : (
            <span>{text}</span>
          )}
        </div>
        <div className="action-icons-container">
          {showEditDeleteIcons && (
            <>
              <IconButton onClick={enableEditComment}>
                <EditIcon htmlColor={VOTED_COLOR} fontSize="small" />
              </IconButton>
              <IconButton onClick={() => alert('TODO: delete comment')}>
                <DeleteIcon htmlColor={VOTED_COLOR} fontSize="small" />
              </IconButton>
            </>
          )}
          {showCancelSaveIcons && (
            <>
              <IconButton onClick={stopEditingComment}>
                <CancelIcon htmlColor={VOTED_COLOR} fontSize="small" />
              </IconButton>
              <IconButton onClick={onEditComment}>
                <SaveIcon htmlColor={VOTED_COLOR} fontSize="small" />
              </IconButton>
            </>
          )}
        </div>
      </div>
      <div className="suggested-by-container commented-by-container">
        <span className="suggested-by-name">
          {t('suggestions.commentedBy')} {name}
        </span>
        <img src={photo} className="suggested-by-photo" alt={`commented-by-${name}`} />
      </div>
    </div>
  );
};

export default Comment;
