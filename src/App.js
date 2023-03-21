import { Route, Routes, BrowserRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import PageWrapper from 'components/common/PageWrapper';
import SideNav from 'components/SideNav';
import { MAIN_ID } from 'constants/componentsIds';
import useTranslation from 'hooks/useTranslation';
import routes from 'routes';

import 'styles/variables.css';
import './App.css';

function App() {
  const t = useTranslation();
  const showSideNav = true;

  return (
    <div className="App">
      <Helmet>
        <title>{t('global.pageTitle')}</title>
      </Helmet>
      <BrowserRouter>
        {showSideNav && <SideNav />}
        <main id={MAIN_ID} {...(showSideNav ? { className: 'page-with-nav' } : {})}>
          <Routes>
            {routes.map(route => (
              <Route
                key={`route-${route.path}`}
                {...route}
                element={
                  <PageWrapper title={route.title} subtitle={route.subtitle}>
                    {route.element}
                  </PageWrapper>
                }
              />
            ))}
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;
