import Select from 'components/common/Select';
import SuggestionCard from 'components/SuggestionCard';
import { SUGGESTIONS_STATUS } from 'constants/types';
import useSuggestions from 'hooks/useSuggestions';
import useTranslation from 'hooks/useTranslation';

import './styles.css';

const Suggestions = () => {
  const t = useTranslation();
  const { filters, onChangeStatusFilter, suggestions } = useSuggestions();

  const { statusFilter } = filters;

  return (
    <>
      <div className="suggestions-container">
        <div className="filters-container">
          <span>{t('suggestions.status')}:</span>
          <div className="status-select-container">
            <Select
              options={SUGGESTIONS_STATUS}
              onChange={onChangeStatusFilter}
              value={statusFilter}
            />
          </div>
        </div>
        {suggestions.map(suggestion => (
          <SuggestionCard suggestion={suggestion} />
        ))}
      </div>
    </>
  );
};

export default Suggestions;
