import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import cn from 'classnames';

import useErrorHandling from 'components/common/RSWordleErrorBoundary/useErrorHandling';
import SkipToMainContent from 'components/SkipToMainContent';
import { SIDE_NAV_TOGGLE_ID } from 'constants/componentsIds';

import { navData } from './navData';
import './sidenav.css';

const SideNav = () => {
  const [open, setOpen] = useState(false);

  const { resetError } = useErrorHandling();

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
                className={({ isActive }) => cn('sideitem', { isActive })}
                to={item.link}
                end={item.end}
                onClick={resetError}
              >
                {item.icon}
                {open && <span className="sidenav-link-text">{item.text}</span>}
              </NavLink>
            ) : null
          )}
        </div>
        <NavLink
          id={settings.id}
          className={({ isActive }) => cn('sideitem', { isActive })}
          to={settings.link}
          onClick={resetError}
        >
          {settings.icon}
          {open && <span className="sidenav-link-text">{settings.text}</span>}
        </NavLink>
      </nav>
    </>
  );
};

export default SideNav;
