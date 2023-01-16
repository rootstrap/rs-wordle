import { useMemo } from 'react';

import LogoutButton from 'components/LogoutButton';
import useAuth from 'hooks/useAuth';
import useTranslation from 'hooks/useTranslation';

import './styles.css';

const InvalidUser = () => {
  const { user } = useAuth();
  const { email, name: completeName } = user || {};
  const name = completeName?.split(' ')[0];

  const t = useTranslation();
  const firstMessage = useMemo(
    () => t('invalidUser.firstMessage', { name, email }),
    [email, name, t]
  );
  const secondMessage = t('invalidUser.secondMessage');

  return (
    <div className="invalid-user-message-container">
      <p className="invalid-user-message">{firstMessage}</p>
      <p className="invalid-user-message">{secondMessage}</p>
      <LogoutButton />
    </div>
  );
};

export default InvalidUser;
