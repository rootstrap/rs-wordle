import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';

import { HOME_ID, RULES_ID } from 'constants/componentsIds';

export const navData = [
  {
    id: HOME_ID,
    icon: <HomeIcon />,
    text: 'Home',
    link: '/',
    end: true,
  },
  {
    id: RULES_ID,
    icon: <InfoIcon />,
    text: 'Rules',
    link: '/rules',
    end: true,
  },
];
