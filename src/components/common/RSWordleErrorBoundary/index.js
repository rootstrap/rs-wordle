import React from 'react';

import Button from 'components/common/Button';
import PageWrapper from 'components/common/PageWrapper';
import LogoutButton from 'components/LogoutButton';
import SideNav from 'components/SideNav';

import ErrorBoundaryContext from './context';
import './styles.css';

class RSWordleErrorBoundary extends React.Component {
  state = { hasError: false, errorMessage: '' };

  static getDerivedStateFromError(error) {
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error, errorInfo) {
    console.error({ error, errorInfo });
  }

  triggerError = ({ error, errorInfo }) => {
    console.error({ error, errorInfo });
    this.setState({ hasError: true, errorMessage: error.message });
  };

  resetError = () => this.setState({ hasError: false, errorMessage: '' });

  render() {
    const { errorMessage, hasError } = this.state;
    const { children, showSideNav, t } = this.props;

    return (
      <ErrorBoundaryContext.Provider
        value={{
          triggerError: this.triggerError,
          resetError: this.resetError,
        }}
      >
        {hasError ? (
          <>
            {showSideNav && <SideNav />}
            <div {...(showSideNav ? { className: 'page-with-nav' } : {})}>
              <PageWrapper>
                <div className="error-boundary-container">
                  <h1>{t('errorBoundary.title')}</h1>
                  <h2>{t('errorBoundary.subtitle')}</h2>
                  <p>{t('errorBoundary.description')}</p>
                  <p className="error-boundary-message">{errorMessage}</p>
                  <div className="error-buttons-container">
                    <div className="try-again-button">
                      <Button handleClick={this.resetError}>{t('errorBoundary.tryAgain')}</Button>
                    </div>
                    <LogoutButton />
                  </div>
                </div>
              </PageWrapper>
            </div>
          </>
        ) : (
          children
        )}
      </ErrorBoundaryContext.Provider>
    );
  }
}

export default RSWordleErrorBoundary;
