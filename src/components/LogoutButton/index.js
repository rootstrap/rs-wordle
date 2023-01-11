import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import Button from 'components/common/Button';
import firebaseData from 'firebase/firebase';
import useTranslation from 'hooks/useTranslation';
import routesPaths from 'routes/routesPaths';
import { logout } from 'state/actions/userActions';

import './styles.css';

const LogoutButton = () => {
  const t = useTranslation();
  const dispatch = useDispatch();
  const { push } = useHistory();
  const { logout: firebaseLogout } = firebaseData;

  const handleLogout = async () => {
    await firebaseLogout();
    await dispatch(logout());
    push(routesPaths.login);
  };

  return (
    <div className="home-logout">
      <Button handleClick={handleLogout}>{t('home.logoutBtn')}</Button>
    </div>
  );
};

export default LogoutButton;
