import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import cn from 'classnames';

import { navData } from './navData';
import './sidenav.css';

const SideNav = () => {
  const [open, setOpen] = useState(false);

  const toggleOpen = () => {
    setOpen(prev => !prev);
  };

  const settings = navData[navData.length - 1];

  return (
    <nav className={cn('sidenav', { closed: !open })}>
      <div>
        <button className="menuBtn" onClick={toggleOpen}>
          {open ? <KeyboardDoubleArrowLeftIcon /> : <KeyboardDoubleArrowRightIcon />}
        </button>
        {navData.map(item =>
          item.id !== 3 ? (
            <NavLink key={item.id} className="sideitem" to={item.link}>
              {item.icon}
              <span className={cn('sidenav-link-text', { closed: !open })}>{item.text}</span>
            </NavLink>
          ) : null
        )}
      </div>
      <NavLink className="sideitem" to={settings.link}>
        {settings.icon}
        <span className={cn('sidenav-link-text', { closed: !open })}>{settings.text}</span>
      </NavLink>
    </nav>
  );
};

export default SideNav;
