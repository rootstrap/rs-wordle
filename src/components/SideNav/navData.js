import HomeIcon from '@mui/icons-material/Home';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import SettingsIcon from '@mui/icons-material/Settings';

export const navData = [
  {
    id: 0,
    icon: <HomeIcon />,
    text: 'Home',
    link: '/',
  },
  {
    id: 1,
    icon: <LeaderboardIcon />,
    text: 'Ranking',
    link: 'ranking',
  },
  {
    id: 2,
    icon: <ShowChartIcon />,
    text: 'Statistics',
    link: 'statistics',
  },
  {
    id: 3,
    icon: <SettingsIcon />,
    text: 'Settings',
    link: 'settings',
  },
];
