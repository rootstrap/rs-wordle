import { Switch, BrowserRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import RouteFromPath from 'components/routes/RouteFromPath';
import SideNav from 'components/SideNav';
import SkipToMainContent from 'components/SkipToMainContent';
import useTranslation from 'hooks/useTranslation';
import useAuth from 'hooks/useAuth';
import routes from 'routes';

import 'styles/variables.css';
import './App.css';

function App() {
  const t = useTranslation();
  const { authenticated } = useAuth();

  return (
    <div className="App">
      <Helmet>
        <title>{t('global.pageTitle')}</title>
      </Helmet>
      <BrowserRouter>
        <SkipToMainContent />
        {authenticated && <SideNav />}
        <main id="main">
          <Switch>
            {routes.map(route => (
              <RouteFromPath key={`route-${route.path}`} {...route} authenticated={authenticated} />
            ))}
          </Switch>
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;
