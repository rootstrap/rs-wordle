import { useEffect } from 'react';

import { Redirect, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useAuthState } from 'react-firebase-hooks/auth';

import firebaseData from 'firebase/firebase';
import useAuth from 'hooks/useAuth';
import useTranslation from 'hooks/useTranslation';
import routesPaths from 'routes/routesPaths';
import Button from 'components/common/Button';
import { login } from 'state/actions/userActions';

import '../../styles/form.css';

const Login = () => {
  // eslint-disable-next-line
  const t = useTranslation();
  const dispatch = useDispatch();
  const { push } = useHistory();
  const { authenticated } = useAuth();
  const { firebaseAuth, signInWithGoogle } = firebaseData;

  const [fbUser, loading, fbError] = useAuthState(firebaseAuth);

  useEffect(() => {
    if (fbUser && !authenticated) {
      const { email, displayName, photoURL, uid } = fbUser;
      push(routesPaths.index);
      dispatch(
        login({
          user: {
            email,
            name: displayName,
            photo: photoURL,
            uid,
          },
        })
      );
    }
  }, [authenticated, dispatch, fbUser, loading, push]);

  if (authenticated) {
    return <Redirect to={routesPaths.index} />;
  }

  return (
    <div>
      <Button disabled={loading} handleClick={signInWithGoogle}>
        Login with Google
      </Button>
      {fbError && <p className="error-message">{fbError}</p>}
    </div>
  );
};

export default Login;
