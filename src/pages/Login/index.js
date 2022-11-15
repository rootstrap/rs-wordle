import { useCallback, useEffect } from 'react';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, Redirect, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { api } from 'services/api';
import { useLoginMutation } from 'services/auth/auth';
import useAuth from 'hooks/useAuth';
import useTranslation from 'hooks/useTranslation';
import routesPaths from 'routes/routesPaths';
import Input from 'components/form/Input';
import Button from 'components/common/Button';

import '../../styles/form.css';

const Login = () => {
  const t = useTranslation();
  const dispatch = useDispatch();
  const { push } = useHistory();
  const [login, { isLoading, isSuccess, error }] = useLoginMutation();
  const { authenticated, user } = useAuth();

  const schema = z.object({
    email: z.string().email({ message: t('login.errors.emailMsg') }),
    password: z.string().min(1, { message: t('login.errors.passwordMsg') }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = data => login(data);

  const resetErrors = useCallback(() => dispatch(api.util.resetApiState()), [dispatch]);

  const handleFocus = () => error && resetErrors();

  useEffect(() => {
    if (isSuccess) {
      push(routesPaths.index);
    }
  }, [isSuccess, user, push]);

  useEffect(() => resetErrors, [resetErrors]);

  if (authenticated) {
    return <Redirect to={routesPaths.index} />;
  }

  return (
    <div className="form">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <h1>{t('login.title')}</h1>
        <label htmlFor="email">{t('login.labels.email')}</label>
        <Input
          register={register}
          type="email"
          name="email"
          error={errors.email}
          handleFocus={handleFocus}
        />

        <label htmlFor="password">{t('login.labels.password')}</label>
        <Input
          register={register}
          type="password"
          name="password"
          error={errors.password}
          handleFocus={handleFocus}
        />

        {error && error.data && <p className="error-message">{error.data.errors}</p>}

        <div className="button-container">
          <Button type="submit" disabled={isLoading}>
            {t('login.title')}
          </Button>
          <Link to={routesPaths.signup}>{t('login.dontHaveAccountMsg')}</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
