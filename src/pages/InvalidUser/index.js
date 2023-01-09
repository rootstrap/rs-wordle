import LogoutButton from 'components/LogoutButton';
import PageWrapper from 'components/common/PageWrapper';
import useAuth from 'hooks/useAuth';

import './styles.css';

const InvalidUser = () => {
  const { user } = useAuth();

  const { email, name: completeName } = user || {};

  const name = completeName?.split(' ')[0];

  return (
    <PageWrapper>
      <div className="invalid-user-message-container">
        <p className="invalid-user-message">
          {`Lo siento ${name} pero tu email "${email}" no pertenece a Rootstrap.`}
        </p>
        <p className="invalid-user-message">
          Por favor cerrá sesión y volvé a ingresar con un email "@rootstrap.com"
        </p>
        <LogoutButton />
      </div>
    </PageWrapper>
  );
};

export default InvalidUser;
