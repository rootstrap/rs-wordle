import { bool, string, node } from 'prop-types';
import { Route, Redirect, useLocation } from 'react-router-dom';

import routesPaths from '../../routes/routesPaths';

const PrivateRoute = ({ children, exact = false, path, authenticated, isRootstrapDomain }) => {
  const location = useLocation();

  return authenticated ? (
    <>
      {isRootstrapDomain || path === routesPaths.invalidUser ? (
        <Route exact={exact} path={path}>
          {children}
        </Route>
      ) : (
        <Redirect
          to={{
            pathname: routesPaths.invalidUser,
            state: { from: location },
          }}
        />
      )}
    </>
  ) : (
    <Redirect
      to={{
        pathname: routesPaths.login,
        state: { from: location },
      }}
    />
  );
};

PrivateRoute.propTypes = {
  children: node.isRequired,
  path: string.isRequired,
  authenticated: bool,
  exact: bool,
};

export default PrivateRoute;
