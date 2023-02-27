import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import flatten from 'flat';
import { HelmetProvider } from 'react-helmet-async';
import { PersistGate } from 'redux-persist/integration/react';

import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from './constants/constants';
import configureStore from 'state/store';
import App from './App';
import locales from './locales';
import './index.css';

// Internationalization setup
const usersLocale = navigator.language.split('-')[0];
const supportedUserLocale = SUPPORTED_LANGUAGES.includes(usersLocale);
const locale = supportedUserLocale ? usersLocale : DEFAULT_LANGUAGE;
const messages = locales[locale];

const { persistor, store } = configureStore();

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <IntlProvider messages={flatten(messages)} locale={locale} defaultLocale={DEFAULT_LANGUAGE}>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <HelmetProvider>
          <App />
        </HelmetProvider>
      </PersistGate>
    </Provider>
  </IntlProvider>
);
