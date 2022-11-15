import { useSelector } from 'react-redux';

import { selectAuth } from 'services/auth/auth';

const useAuth = () => {
  const { user, authenticated } = useSelector(selectAuth);

  return {
    user,
    authenticated,
  };
};

export default useAuth;
