import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import { IconButton } from '@mui/material';

import Select from 'components/common/Select';
import SuggestionCard from 'components/SuggestionCard';
import SuggestionModal from 'components/SuggestionModal';
import { MODAL_TYPE, SUGGESTIONS_STATUS } from 'constants/types';
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
    addEditNewSuggestion,
    deleteSuggestion,
    voteSuggestion,
    isModalOpen,
    modalMode,
    handleOpenModal,
    handleCloseModal,
    errors,
    isLoading,
    addComment,
    selectedComment,
    changeSelectedComment,
    updateComment,
  } = useSuggestions();
  const { statusFilter } = filters;

  return (
    <div className="suggestions-container">
      <h3>{t('suggestions.slogan')}</h3>
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
        <SuggestionCard
          key={suggestion.id}
          suggestion={suggestion}
          deleteSuggestion={deleteSuggestion}
          voteSuggestion={voteSuggestion}
          openEditModal={() => handleOpenModal(MODAL_TYPE.edit, suggestion)}
          addComment={addComment}
          selectedComment={selectedComment}
          changeSelectedComment={changeSelectedComment}
          updateComment={updateComment}
        />
      ))}
      <SuggestionModal
        newSuggestion={newSuggestion}
        onChangeNewSuggestion={onChangeNewSuggestion}
        addEditNewSuggestion={addEditNewSuggestion}
        isModalOpen={isModalOpen}
        modalMode={modalMode}
        handleCloseModal={handleCloseModal}
        errors={errors}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Suggestions;
