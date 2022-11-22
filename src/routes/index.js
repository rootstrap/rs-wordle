import routesPaths from './routesPaths';
import Home from 'pages/Home';
import Login from 'pages/Login';
import Ranking from 'pages/Ranking';
import Settings from 'pages/Settings';
import Statistics from 'pages/Statistics';

const routes = [
  {
    path: routesPaths.index,
    component: <Home />,
    exact: true,
    private: true,
  },
  {
    path: routesPaths.ranking,
    component: <Ranking />,
    exact: true,
    private: true,
  },
  {
    path: routesPaths.settings,
    component: <Settings />,
    exact: true,
    private: true,
  },
  {
    path: routesPaths.statistics,
    component: <Statistics />,
    exact: true,
    private: true,
  },
  {
    path: routesPaths.login,
    component: <Login />,
  },
];

export default routes;
