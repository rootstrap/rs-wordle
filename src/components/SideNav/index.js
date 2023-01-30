import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import cn from 'classnames';

import SkipToMainContent from 'components/SkipToMainContent';
import { SIDE_NAV_TOGGLE_ID } from 'constants/componentsIds';

import { navData } from './navData';
import './sidenav.css';

const SideNav = () => {
  const [open, setOpen] = useState(false);

  const toggleOpen = () => {
    setOpen(prev => !prev);
  };

  const settingsIndex = navData.length - 1;
  const settings = navData[settingsIndex];

  return (
    <>
      <SkipToMainContent />
      <nav className={cn('sidenav', { closed: !open })}>
        <div>
          <button id={SIDE_NAV_TOGGLE_ID} className="menuBtn" onClick={toggleOpen}>
            {open ? <KeyboardDoubleArrowLeftIcon /> : <KeyboardDoubleArrowRightIcon />}
          </button>
          {navData.map((item, index) =>
            index !== settingsIndex ? (
              <NavLink
                id={item.id}
                key={item.id}
                className="sideitem"
                activeClassName="selected-item"
                to={item.link}
                exact={item.exact}
              >
                {item.icon}
                {open && <span className="sidenav-link-text">{item.text}</span>}
              </NavLink>
            ) : null
          )}
        </div>
        <NavLink
          id={settings.id}
          className="sideitem"
          activeClassName="selected-item"
          to={settings.link}
        >
          {settings.icon}
          {open && <span className="sidenav-link-text">{settings.text}</span>}
        </NavLink>
      </nav>
    </>
  );
};

export default SideNav;
