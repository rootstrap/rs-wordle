import routesPaths from './routesPaths';
import Home from 'pages/Home';
import InvalidUser from 'pages/InvalidUser';
import Login from 'pages/Login';
import Ranking from 'pages/Ranking';
import Rules from 'pages/Rules';
import Settings from 'pages/Settings';
import Statistics from 'pages/Statistics';
import Suggestions from 'pages/Suggestions';
import Users from 'pages/Users';

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
    title: 'Ranking',
  },
  {
    path: routesPaths.rules,
    component: <Rules />,
    exact: true,
    private: true,
    title: 'RULES',
    subtitle: 'Can you guess the word before other Rootstrappers do?',
  },
  {
    path: routesPaths.settings,
    component: <Settings />,
    exact: true,
    private: true,
    title: 'Settings (more coming soon 👀)',
  },
  {
    path: routesPaths.statistics,
    component: <Statistics />,
    exact: true,
    private: true,
  },
  {
    path: routesPaths.users,
    component: <Users />,
    exact: true,
    private: true,
    title: 'Users',
  },
  {
    path: routesPaths.usersStatistics,
    component: <Statistics />,
    exact: true,
    private: true,
  },
  {
    path: routesPaths.suggestions,
    component: <Suggestions />,
    exact: true,
    private: true,
    title: 'Suggestions',
  },
  {
    path: routesPaths.login,
    component: <Login />,
  },
  {
    path: routesPaths.invalidUser,
    component: <InvalidUser />,
    exact: true,
    private: true,
  },
];

export default routes;
