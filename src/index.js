import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import flatten from 'flat';
import { HelmetProvider } from 'react-helmet-async';

import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from './constants/constants';
import store from 'state/store';
import App from './App';
import locales from './locales';
import './index.css';

// Internationalization setup
const usersLocale = navigator.language.split('-')[0];
const supportedUserLocale = SUPPORTED_LANGUAGES.includes(usersLocale);
const locale = supportedUserLocale ? usersLocale : DEFAULT_LANGUAGE;
const messages = locales[locale];

ReactDOM.render(
  <React.StrictMode>
    <IntlProvider messages={flatten(messages)} locale={locale} defaultLocale={DEFAULT_LANGUAGE}>
      <Provider store={store}>
        <HelmetProvider>
          <App />
        </HelmetProvider>
      </Provider>
    </IntlProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
