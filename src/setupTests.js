import '@testing-library/jest-dom';
import { render as rtlRender } from '@testing-library/react';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { configureStore } from '@reduxjs/toolkit';
import flatten from 'flat';

import locales from './locales';

const reducer = {
  // TODO: Update when we have reducers
};

const render = (
  ui,
  {
    locale = 'en',
    preloadedState,
    store = configureStore({ reducer, preloadedState }),
    ...renderOptions
  } = {}
) => {
  const Wrapper = ({ children }) => (
    <IntlProvider locale={locale} messages={flatten(locales[locale])}>
      <Provider store={store}>{children}</Provider>
    </IntlProvider>
  );

  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
};

// re-export everything
export * from '@testing-library/react';

// override render method
export { render };
