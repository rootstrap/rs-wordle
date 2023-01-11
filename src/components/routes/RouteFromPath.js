import { Route } from 'react-router-dom';
import { node } from 'prop-types';

import PrivateRoute from './PrivateRoute';
import PageWrapper from 'components/common/PageWrapper';

const RouteFromPath = ({ component, title, subtitle, ...route }) => (
  <PageWrapper title={title} subtitle={subtitle}>
    {route.private ? (
      <PrivateRoute {...route}>{component}</PrivateRoute>
    ) : (
      <Route {...route}>{component}</Route>
    )}
  </PageWrapper>
);

RouteFromPath.propTypes = {
  component: node.isRequired,
};

export default RouteFromPath;
