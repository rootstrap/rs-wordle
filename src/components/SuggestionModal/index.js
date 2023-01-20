import { useMemo } from 'react';
import { Modal } from '@mui/material';

import Button from 'components/common/Button';
import Loading from 'components/common/Loading';
import { MODAL_TYPE } from 'constants/types';
import useTranslation from 'hooks/useTranslation';

import './styles.css';

const SuggestionModal = ({
  newSuggestion,
  onChangeNewSuggestion,
  addEditNewSuggestion,
  isModalOpen,
  modalMode,
  handleCloseModal,
  errors,
  isLoading,
}) => {
  const t = useTranslation();

  const { title, description } = newSuggestion;
  const { title: titleError, description: descriptionError } = errors;
  const isEdit = modalMode === MODAL_TYPE.edit;
  const buttonText = useMemo(
    () => (isEdit ? t('suggestions.editSuggestion') : t('suggestions.addSuggestion')),
    [isEdit, t]
  );

  return (
    <Modal open={isModalOpen} onClose={handleCloseModal}>
      <div className="modal-container">
        {isLoading ? (
          <Loading />
        ) : (
          <>
            <div className="field-container">
              <span className="field-label">{t('suggestions.title')}</span>
              <input
                type="text"
                value={title}
                onChange={({ target: { value: newValue } }) =>
                  onChangeNewSuggestion('title', newValue)
                }
              />
              <span className="error-message">{titleError}</span>
            </div>
            <div className="field-container">
              <span className="field-label">{t('suggestions.description')}</span>
              <textarea
                value={description}
                onChange={({ target: { value: newValue } }) =>
                  onChangeNewSuggestion('description', newValue)
                }
                rows={10}
              />
              <span className="error-message">{descriptionError}</span>
            </div>
            <div className="add-suggestion-button">
              <Button handleClick={addEditNewSuggestion}>{buttonText}</Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default SuggestionModal;
