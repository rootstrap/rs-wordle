import { useSelector } from 'react-redux';

const useAuth = () => {
  const { user, authenticated } = useSelector(({ user: { user, authenticated } }) => ({
    user,
    authenticated,
  }));

  return {
    user,
    authenticated,
  };
};

export default useAuth;
