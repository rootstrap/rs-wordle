import { useCallback } from 'react';
import { useIntl } from 'react-intl';

const useTranslation = () => {
  const intl = useIntl();

  const translation = useCallback(
    (message, values) => intl.formatMessage({ id: message }, values),
    [intl]
  );

  return translation;
};

export default useTranslation;
