import { useState } from 'react';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton } from '@mui/material';

import DeleteDialog from 'components/common/DeleteDialog';
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
  handleDeleteComment,
}) => {
  const t = useTranslation();
  const {
    user: { uid },
  } = useAuth();

  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
  const handleOpenDialog = () => setIsDialogOpen(true);
  const handleCloseDialog = () => setIsDialogOpen(false);
  const onDeleteComment = () => handleDeleteComment(id);
  const handleDeleteSuggestion = async () => {
    await onDeleteComment();
    setIsDialogOpen(false);
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
              <IconButton onClick={handleOpenDialog}>
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
      <DeleteDialog
        isDialogOpen={isDialogOpen}
        handleCloseDialog={handleCloseDialog}
        handleConfirmDialog={handleDeleteSuggestion}
        title={t('comments.confirmTitle')}
        description={t('comments.confirmDescription')}
      />
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
