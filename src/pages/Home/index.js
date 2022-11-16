import { Redirect, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import Button from 'components/common/Button';
import Word from 'components/Word';
import firebaseData from 'firebase/firebase';
import useAuth from 'hooks/useAuth';
import useTranslation from 'hooks/useTranslation';
import routesPaths from 'routes/routesPaths';
import { logout } from 'state/actions/userActions';

import './styles.css';

const Home = () => {
  const { authenticated } = useAuth();

  const t = useTranslation();
  const dispatch = useDispatch();
  const { push } = useHistory();
  const { logout: firebaseLogout } = firebaseData;

  const handleLogout = async () => {
    await firebaseLogout();
    await dispatch(logout());
    push(routesPaths.login);
  };

  if (!authenticated) {
    return <Redirect to={routesPaths.login} />;
  }

  return (
    <div className="home">
      <Word word="GENIA" />
      <div className="home__logout">
        <Button handleClick={handleLogout}>{t('home.logoutBtn')}</Button>
      </div>
    </div>
  );
};

export default Home;
