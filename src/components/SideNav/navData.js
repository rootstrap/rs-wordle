import HomeIcon from '@mui/icons-material/Home';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import SettingsIcon from '@mui/icons-material/Settings';
import InfoIcon from '@mui/icons-material/Info';
import GroupIcon from '@mui/icons-material/Group';

import {
  HOME_ID,
  RANKING_ID,
  STATISTICS_ID,
  USERS_ID,
  RULES_ID,
  SETTINGS_ID,
} from 'constants/componentsIds';

export const navData = [
  {
    id: HOME_ID,
    icon: <HomeIcon />,
    text: 'Home',
    link: '/',
    exact: true,
  },
  {
    id: RANKING_ID,
    icon: <LeaderboardIcon />,
    text: 'Ranking',
    link: '/ranking',
    exact: true,
  },
  {
    id: STATISTICS_ID,
    icon: <ShowChartIcon />,
    text: 'Statistics',
    link: '/statistics',
    exact: true,
  },
  {
    id: USERS_ID,
    icon: <GroupIcon />,
    text: 'Users',
    link: '/users',
    exact: true,
  },
  {
    id: RULES_ID,
    icon: <InfoIcon />,
    text: 'Rules',
    link: '/rules',
    exact: true,
  },
  {
    id: SETTINGS_ID,
    icon: <SettingsIcon />,
    text: 'Settings',
    link: '/settings',
    exact: true,
  },
];
