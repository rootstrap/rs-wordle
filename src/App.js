import { Switch, BrowserRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import RouteFromPath from 'components/routes/RouteFromPath';
import SideNav from 'components/SideNav';
import useTranslation from 'hooks/useTranslation';
import useAuth from 'hooks/useAuth';
import routes from 'routes';

import 'styles/variables.css';
import './App.css';

function App() {
  const t = useTranslation();
  const { authenticated, user } = useAuth();

  const { email = '' } = user || {};
  const emailDomain = email.split('@')[1];
  const isRootstrapDomain = emailDomain === 'rootstrap.com';

  return (
    <div className="App">
      <Helmet>
        <title>{t('global.pageTitle')}</title>
      </Helmet>
      <BrowserRouter>
        {authenticated && isRootstrapDomain && <SideNav />}
        <main>
          <Switch>
            {routes.map(route => (
              <RouteFromPath
                key={`route-${route.path}`}
                {...route}
                authenticated={authenticated}
                isRootstrapDomain={isRootstrapDomain}
              />
            ))}
          </Switch>
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;
