import { useState } from 'react';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  ThumbDownAlt as ThumbDownAltIcon,
  ThumbUpAlt as ThumbUpAltIcon,
} from '@mui/icons-material';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from '@mui/material';

import Button from 'components/common/Button';
import { VOTED_COLOR } from 'constants/constants';
import useTranslation from 'hooks/useTranslation';

import './styles.css';

const BACKGROUND_COLOR = '#1a1a1b';
const TEXT_COLOR = 'white';

const SuggestionCard = ({
  suggestion: {
    description,
    id,
    isMySuggestion,
    negativeVotesCount,
    positiveVotesCount,
    status,
    statusColor,
    suggestedBy: { name, photo },
    title,
    votedNegative,
    votedPositive,
  },
  deleteSuggestion,
  openEditModal,
}) => {
  const t = useTranslation();
  const isPending = status === 'Pending';

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const handleOpenDialog = () => setIsDialogOpen(true);
  const handleCloseDialog = () => setIsDialogOpen(false);
  const handleDeleteSuggestion = () => {
    const isOk = deleteSuggestion(id);
    isOk && handleCloseDialog();
  };

  return (
    <div className="suggestion-card-container">
      <div className="left-container">
        <span className="suggestion-title">{title}</span>
        {isMySuggestion && isPending && (
          <>
            <IconButton onClick={openEditModal}>
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton onClick={handleOpenDialog}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </>
        )}
        <p>{description}</p>
        <div className="suggested-by-container">
          <span className="suggested-by-name">
            {t('suggestions.suggestedBy')} {name}
          </span>
          <img src={photo} className="suggested-by-photo" alt={`suggested-by-${name}`} />
        </div>
      </div>
      <div className="right-container">
        <span className="status" style={{ backgroundColor: statusColor }}>
          {status}
        </span>
        <div className="votes-container">
          <div className="votes-item-container">
            <ThumbUpAltIcon color={votedPositive ? VOTED_COLOR : ''} />
            <span className="vote-count">{positiveVotesCount}</span>
          </div>
          <div className="votes-item-container">
            <ThumbDownAltIcon color={votedNegative ? VOTED_COLOR : ''} />
            <span className="vote-count">{negativeVotesCount}</span>
          </div>
        </div>
      </div>
      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          style: {
            backgroundColor: BACKGROUND_COLOR,
            color: TEXT_COLOR,
          },
        }}
      >
        <DialogTitle id="alert-dialog-title">{t('suggestions.confirmTitle')}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" style={{ color: TEXT_COLOR }}>
            {t('suggestions.confirmDescription', { title })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button handleClick={handleCloseDialog}>{t('suggestions.cancelDelete')}</Button>
          <Button handleClick={handleDeleteSuggestion}>{t('suggestions.confirmDelete')}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SuggestionCard;
