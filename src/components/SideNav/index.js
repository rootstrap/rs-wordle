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

  return (
    <nav className={cn('sidenav', { closed: !open })}>
      <button className="menuBtn" onClick={toggleOpen}>
        {open ? <KeyboardDoubleArrowLeftIcon /> : <KeyboardDoubleArrowRightIcon />}
      </button>
      {navData.map(item => (
        <NavLink key={item.id} className={'sideitem'} to={item.link}>
          {item.icon}
          <span className={cn('sidenav-link-text', { closed: !open })}>{item.text}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default SideNav;
