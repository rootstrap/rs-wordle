import Logo from 'components/Logo';
import LogoutButton from 'components/LogoutButton';

import './styles.css';

const Settings = () => (
  <div className="settings">
    <Logo />
    <h1 className="section-title">Settings</h1>
    <LogoutButton />
  </div>
);

export default Settings;
