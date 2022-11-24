import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import cn from 'classnames';
import ReplayIcon from '@mui/icons-material/Replay';

import { GAME_STATUS } from 'constants/types';
import useRankingData from 'hooks/useRankingData';

import './styles.css';

const Ranking = () => {
  const { currentUser, dailyResults } = useRankingData();

  return (
    <div className="ranking">
      <h1 className="ranking-title">Ranking</h1>
      <Tabs className="Tabs">
        <TabList>
          <Tab>Today</Tab>
          <Tab>All Time Average</Tab>
        </TabList>
        <TabPanel>
          {dailyResults.map(({ attempts, status, user: { email, name, photo } }, index) => {
            const isCurrentUser = email === currentUser;
            const lost = status === GAME_STATUS.lost;

            return (
              <div className={cn('daily-data-container', { isCurrentUser, lost })}>
                <p className="daily-position">{index + 1}</p>
                <div className="daily-data-user">
                  <img src={photo} className="daily-data-photo" alt="user" />
                  <p className="daily-data-name">{name}</p>
                </div>
                <div className="daily-data-attempts-container">
                  <p className="daily-data-attempts">{attempts}</p>
                  <ReplayIcon fontSize="small" />
                </div>
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
