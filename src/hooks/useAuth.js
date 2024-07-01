import { useSelector } from 'react-redux';

const useAuth = () => {
  const { user, authenticated, wasOnboardingShown } = useSelector(
    ({ user: { user, authenticated, wasOnboardingShown } }) => ({
      user,
      authenticated,
      wasOnboardingShown,
    })
  );

  return {
    user,
    authenticated,
    wasOnboardingShown,
  };
};

export default useAuth;
