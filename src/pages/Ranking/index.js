import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import cn from 'classnames';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { GAME_STATUS } from 'constants/types';
import useRankingData from 'hooks/useRankingData';

import './styles.css';

const WORD_HEIGHT = 40;

const Ranking = () => {
  const { currentUser, currentUserPlayed, dailyResults, expandedUser, setExpandedUser } =
    useRankingData();

  return (
    <div className="ranking">
      <h1 className="section-title">Ranking</h1>
      <Tabs className="Tabs">
        <TabList>
          <Tab>Today</Tab>
          <Tab>All Time Average</Tab>
        </TabList>
        <TabPanel>
          {dailyResults.map(
            ({ attemptedWords, attempts, position, status, user: { email, name, photo } }) => {
              const isCurrentUser = email === currentUser;
              const lost = status === GAME_STATUS.lost;
              const isExpanded = email === expandedUser;
              const isDisabled = !currentUserPlayed;

              return (
                <>
                  <button
                    key={`${email}-${attempts}`}
                    className={cn('daily-data-container', { isCurrentUser, lost, isDisabled })}
                    onClick={() => (isExpanded ? setExpandedUser('') : setExpandedUser(email))}
                    disabled={!currentUserPlayed}
                  >
                    <span className="daily-position">{position}</span>
                    <div className="daily-data-user">
                      <img src={photo} className="daily-data-photo" alt="user" />
                      <span className="daily-data-name">{name}</span>
                    </div>
                    <span className="daily-data-attempts">{lost ? 'X' : attempts}</span>
                    {currentUserPlayed && (
                      <div className="daily-data-expand-icon">
                        {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </div>
                    )}
                  </button>
                  {currentUserPlayed && (
                    <div
                      className={cn('daily-data-words', { isExpanded })}
                      style={{ height: isExpanded ? attemptedWords.length * WORD_HEIGHT : 0 }}
                    >
                      {attemptedWords.map(({ word = '', results }) => (
                        <div className={cn('daily-data-word-container', { isExpanded })}>
                          {word.split('').map((letter, index) => (
                            <span
                              key={`${word}-${index}`}
                              className={cn('daily-data-word', { isExpanded })}
                              style={{ backgroundColor: results[index] }}
                            >
                              {letter}
                            </span>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              );
            }
          )}
        </TabPanel>
        <TabPanel>
          <h2>In Progress...</h2>
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default Ranking;
