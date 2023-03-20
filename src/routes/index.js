import routesPaths from './routesPaths';
import Home from 'pages/Home';
import Rules from 'pages/Rules';

const routes = [
  {
    path: routesPaths.index,
    element: <Home />,
    isPrivate: true,
  },
  {
    path: routesPaths.rules,
    element: <Rules />,
    isPrivate: true,
    title: 'RULES',
    subtitle: 'Can you guess the word before other Rootstrappers do?',
  },
];

export default routes;
