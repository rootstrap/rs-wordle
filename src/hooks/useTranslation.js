import { useIntl } from 'react-intl';

const useTranslation = () => {
  const intl = useIntl();

  return (message, values) => intl.formatMessage({ id: message }, values);
};

export default useTranslation;
