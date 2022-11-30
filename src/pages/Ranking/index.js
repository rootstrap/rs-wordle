import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import cn from 'classnames';

import { GAME_STATUS } from 'constants/types';
import useRankingData from 'hooks/useRankingData';

import './styles.css';

const Ranking = () => {
  const { currentUser, dailyResults } = useRankingData();

  return (
    <div className="ranking">
      <h1 className="section-title">Ranking</h1>
      <Tabs className="Tabs">
        <TabList>
          <Tab>Today</Tab>
          <Tab>All Time Average</Tab>
        </TabList>
        <TabPanel>
          {dailyResults.map(({ attempts, position, status, user: { email, name, photo } }) => {
            const isCurrentUser = email === currentUser;
            const lost = status === GAME_STATUS.lost;

            return (
              <div
                key={`${email}-${attempts}`}
                className={cn('daily-data-container', { isCurrentUser, lost })}
              >
                <span className="daily-position">{position}</span>
                <div className="daily-data-user">
                  <img src={photo} className="daily-data-photo" alt="user" />
                  <span className="daily-data-name">{name}</span>
                </div>
                <span className="daily-data-attempts">{lost ? 'X' : attempts}</span>
              </div>
            );
          })}
        </TabPanel>
        <TabPanel>
          <h2>In Progress...</h2>
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default Ranking;
