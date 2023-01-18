import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';

import useTranslation from 'hooks/useTranslation';

import './styles.css';

const SuggestionCard = ({
  suggestion: {
    description,
    negativeVotesCount,
    positiveVotesCount,
    status,
    statusColor,
    suggestedBy: { name, photo },
    title,
    votedNegative,
    votedPositive,
  },
}) => {
  const t = useTranslation();

  const votedColor = 'action';

  return (
    <div className="suggestion-card-container">
      <div className="left-container">
        <span className="suggestion-title">{title}</span>
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
            <ThumbUpAltIcon color={votedPositive ? votedColor : ''} />
            <span className="vote-count">{positiveVotesCount}</span>
          </div>
          <div className="votes-item-container">
            <ThumbDownAltIcon color={votedNegative ? votedColor : ''} />
            <span className="vote-count">{negativeVotesCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuggestionCard;
