import { bool, string, node } from 'prop-types';
import { Navigate, useLocation } from 'react-router-dom';

import routesPaths from '../../routes/routesPaths';

const PrivateRoute = ({ children, isPrivate, path, authenticated, isRootstrapDomain }) => {
  const location = useLocation();

  if (!isPrivate) {
    return children;
  }

  if (!authenticated) {
    return <Navigate to={routesPaths.login} state={{ from: location }} />;
  }

  if (authenticated && !isRootstrapDomain && path !== routesPaths.invalidUser) {
    return <Navigate to={routesPaths.invalidUser} state={{ from: location }} />;
  }

  return children;
};

PrivateRoute.propTypes = {
  children: node.isRequired,
  isPrivate: bool,
  path: string.isRequired,
  authenticated: bool,
};

export default PrivateRoute;
