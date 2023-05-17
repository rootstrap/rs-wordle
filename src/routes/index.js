import routesPaths from './routesPaths';
import DeveloperTools from 'pages/DeveloperTools';
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
    element: <Home />,
    isPrivate: true,
  },
  {
    path: routesPaths.ranking,
    element: <Ranking />,
    isPrivate: true,
    title: 'Ranking',
  },
  {
    path: routesPaths.rules,
    element: <Rules />,
    isPrivate: true,
    title: 'RULES',
    subtitle: 'Can you guess the word before other Rootstrappers do?',
  },
  {
    path: routesPaths.settings,
    element: <Settings />,
    isPrivate: true,
    title: 'Settings (more coming soon 👀)',
  },
  {
    path: routesPaths.statistics,
    element: <Statistics />,
    isPrivate: true,
  },
  {
    path: routesPaths.users,
    element: <Users />,
    isPrivate: true,
    title: 'Users',
  },
  {
    path: routesPaths.usersStatistics,
    element: <Statistics />,
    isPrivate: true,
  },
  {
    path: routesPaths.suggestions,
    element: <Suggestions />,
    isPrivate: true,
    title: 'Suggestions',
  },
  {
    path: routesPaths.login,
    element: <Login />,
  },
  {
    path: routesPaths.invalidUser,
    element: <InvalidUser />,
    isPrivate: true,
  },
  {
    path: routesPaths.developerTools,
    element: <DeveloperTools />,
    isOnlyDevelop: true,
    isPrivate: true,
  },
];

export default routes;
