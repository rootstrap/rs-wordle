import HomeIcon from '@mui/icons-material/Home';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import SettingsIcon from '@mui/icons-material/Settings';
import InfoIcon from '@mui/icons-material/Info';
import GroupIcon from '@mui/icons-material/Group';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';

import {
  HOME_ID,
  RANKING_ID,
  STATISTICS_ID,
  USERS_ID,
  SUGGESTIONS_ID,
  RULES_ID,
  SETTINGS_ID,
} from 'constants/componentsIds';

export const navData = [
  {
    id: HOME_ID,
    icon: <HomeIcon />,
    text: 'Home',
    link: '/',
    end: true,
  },
  {
    id: RANKING_ID,
    icon: <LeaderboardIcon />,
    text: 'Ranking',
    link: '/ranking',
    end: true,
  },
  {
    id: STATISTICS_ID,
    icon: <ShowChartIcon />,
    text: 'Statistics',
    link: '/statistics',
    end: true,
  },
  {
    id: USERS_ID,
    icon: <GroupIcon />,
    text: 'Users',
    link: '/users',
    end: true,
  },
  {
    id: SUGGESTIONS_ID,
    icon: <QuestionAnswerIcon />,
    text: 'Suggestions',
    link: '/suggestions',
    end: true,
  },
  {
    id: RULES_ID,
    icon: <InfoIcon />,
    text: 'Rules',
    link: '/rules',
    end: true,
  },
  {
    id: SETTINGS_ID,
    icon: <SettingsIcon />,
    text: 'Settings',
    link: '/settings',
    end: true,
  },
];
