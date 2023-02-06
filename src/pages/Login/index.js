import { useEffect } from 'react';

import { Navigate, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useAuthState } from 'react-firebase-hooks/auth';

import firebaseData from 'firebase/firebase';
import useAuth from 'hooks/useAuth';
import useTranslation from 'hooks/useTranslation';
import routesPaths from 'routes/routesPaths';
import Button from 'components/common/Button';
import { login } from 'state/actions/userActions';

import './styles.css';

const Login = () => {
  // eslint-disable-next-line
  const t = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { authenticated } = useAuth();
  const { firebaseAuth, signInWithGoogle } = firebaseData;

  const [fbUser, loading, fbError] = useAuthState(firebaseAuth);

  useEffect(() => {
    if (fbUser && !authenticated) {
      const { email, displayName, photoURL, uid } = fbUser;
      navigate(routesPaths.index);
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
  }, [authenticated, dispatch, fbUser, loading, navigate]);

  if (authenticated) {
    return <Navigate to={routesPaths.index} />;
  }

  return (
    <>
      <div className="login-button">
        <Button disabled={loading} handleClick={signInWithGoogle}>
          {t('login.title')}
        </Button>
      </div>
      {fbError && <p className="error-message">{fbError}</p>}
    </>
  );
};

export default Login;
