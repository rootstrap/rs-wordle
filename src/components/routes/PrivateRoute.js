import { bool, string, node } from 'prop-types';
import { Navigate, useLocation } from 'react-router-dom';

import routesPaths from '../../routes/routesPaths';

const PrivateRoute = ({ children, isPrivate, path }) => {
  const location = useLocation();

  if (!isPrivate) {
    return children;
  }

  return children;
};

PrivateRoute.propTypes = {
  children: node.isRequired,
  isPrivate: bool,
  path: string.isRequired,
};

export default PrivateRoute;
