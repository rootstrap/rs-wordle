import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import { IconButton, Modal } from '@mui/material';

import Button from 'components/common/Button';
import Loading from 'components/common/Loading';
import Select from 'components/common/Select';
import SuggestionCard from 'components/SuggestionCard';
import { SUGGESTIONS_STATUS } from 'constants/types';
import useSuggestions from 'hooks/useSuggestions';
import useTranslation from 'hooks/useTranslation';

import './styles.css';

const Suggestions = () => {
  const t = useTranslation();
  const {
    filters,
    onChangeFilter,
    suggestions,
    newSuggestion,
    onChangeNewSuggestion,
    addNewSuggestion,
    isModalOpen,
    handleOpenModal,
    handleCloseModal,
    errors,
    isLoading,
  } = useSuggestions();
  const { statusFilter } = filters;
  const { title, description } = newSuggestion;
  const { title: titleError, description: descriptionError } = errors;

  return (
    <div className="suggestions-container">
      <div className="header-container">
        <div className="filters-container">
          <span className="status">{t('suggestions.status')}:</span>
          <div className="status-select-container">
            <Select
              options={SUGGESTIONS_STATUS}
              onChange={newValue => onChangeFilter('statusFilter', newValue)}
              value={statusFilter}
            />
          </div>
        </div>
        <IconButton color="success" onClick={handleOpenModal}>
          <AddCircleOutlinedIcon fontSize="large" />
        </IconButton>
      </div>
      {suggestions.map(suggestion => (
        <SuggestionCard key={suggestion.id} suggestion={suggestion} />
      ))}
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
                <Button handleClick={addNewSuggestion}>{t('suggestions.addSuggestion')}</Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Suggestions;
