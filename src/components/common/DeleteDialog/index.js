import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

import Button from 'components/common/Button';
import { BACKGROUND_COLOR, TEXT_COLOR } from 'constants/constants';
import useTranslation from 'hooks/useTranslation';

import './styles.css';

const DeleteDialog = ({
  isDialogOpen,
  handleCloseDialog,
  handleConfirmDialog,
  title,
  description,
}) => {
  const t = useTranslation();

  return (
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
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description" style={{ color: TEXT_COLOR }}>
          {description}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button handleClick={handleCloseDialog}>{t('global.cancel')}</Button>
        <Button handleClick={handleConfirmDialog}>{t('global.confirm')}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;
