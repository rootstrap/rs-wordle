import ListRow from 'components/common/ListRow';
import { GAME_STATUS, LETTER_STATUS } from 'constants/types';
import useRankingData from 'hooks/useRankingData';
import { pluralize } from 'utils/helpers';

import './styles.css';

const WORD_HEIGHT = 40;

const Today = () => {
  const { currentUser, currentUserPlayed, dailyResults } = useRankingData();

  return (
    <>
      {dailyResults.map(
        ({
          attemptedWords,
          attempts,
          position,
          solveTime,
          status,
          user: { email, name, photo },
        }) => {
          const isCurrentUser = email === currentUser;
          const lost = status === GAME_STATUS.lost;
          const isDisabled = !currentUserPlayed;

          return (
            <ListRow
              key={email}
              classProps={{ isCurrentUser, lost, isDisabled }}
              disabled={!currentUserPlayed}
              name={name}
              photo={photo}
              leftText={position}
              rightText={lost ? 'X' : attempts}
              suffix={`(${pluralize(solveTime, 'min')})`}
              showIcon={currentUserPlayed}
              expandedHeight={attemptedWords.length * WORD_HEIGHT}
            >
              {attemptedWords.map(({ word = '', results }) => (
                <div key={word} className="daily-data-word-container">
                  {word.split('').map((letter, index) => (
                    <span
                      key={`${word}-${index}`}
                      className="daily-data-word"
                      style={{
                        backgroundColor: LETTER_STATUS[results[index]]?.color,
                      }}
                    >
                      {letter}
                    </span>
                  ))}
                </div>
              ))}
            </ListRow>
          );
        }
      )}
    </>
  );
};

export default Today;
