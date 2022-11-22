import { Redirect } from 'react-router-dom';

import Word from 'components/Word';
import useAuth from 'hooks/useAuth';
import routesPaths from 'routes/routesPaths';

import './styles.css';

const Home = () => {
  const { authenticated } = useAuth();

  if (!authenticated) {
    return <Redirect to={routesPaths.login} />;
  }

  return (
    <div className="home">
      <Word />
    </div>
  );
};

export default Home;
