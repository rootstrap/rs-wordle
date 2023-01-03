import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import ListRow from 'components/common/ListRow';
import Loading from 'components/common/Loading';
import Select from 'components/common/Select';
import { GAME_STATUS, RANKING_VALUES, LETTER_STATUS } from 'constants/types';
import useRankingData from 'hooks/useRankingData';

import './styles.css';
import { pluralize } from 'utils/helpers';

const WORD_HEIGHT = 40;

const Ranking = () => {
  const {
    currentUser,
    currentUserPlayed,
    rankingData,
    dailyResults,
    loading,
    selectedRanking,
    onChangeSelectedRanking,
    goToUsersStatistics,
  } = useRankingData();

  return (
    <div className="ranking">
      <h1 className="section-title">Ranking</h1>
      {loading ? (
        <Loading />
      ) : (
        <Tabs className="Tabs">
          <TabList>
            <Tab>{`Today (${dailyResults.length})`}</Tab>
            <Tab>{`All Time (${rankingData.length})`}</Tab>
          </TabList>
          <TabPanel>
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
          </TabPanel>
          <TabPanel>
            <>
              <Select
                options={RANKING_VALUES}
                onChange={onChangeSelectedRanking}
                value={selectedRanking}
              />
              {rankingData.map(
                ({ position, rightText, suffix, user: { email, name, photo }, user }) => {
                  const isCurrentUser = email === currentUser;

                  return (
                    <ListRow
                      key={email}
                      classProps={{ isCurrentUser }}
                      name={name}
                      photo={photo}
                      leftText={position}
                      rightText={rightText}
                      suffix={suffix}
                      showIcon={false}
                      onClick={() => goToUsersStatistics(user)}
                    />
                  );
                }
              )}
            </>
          </TabPanel>
        </Tabs>
      )}
    </div>
  );
};

export default Ranking;
