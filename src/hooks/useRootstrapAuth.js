import useAuth from 'hooks/useAuth';

const useRootstrapAuth = () => {
  const { user } = useAuth();

  const { email = '' } = user || {};
  const emailDomain = email.split('@')[1];
  const isRootstrapDomain = emailDomain === 'rootstrap.com';

  return { isRootstrapDomain };
};

export default useRootstrapAuth;
