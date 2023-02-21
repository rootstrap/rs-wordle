import { useState } from 'react';
import QuestionMarkIcon from '@mui/icons-material/HelpOutlineOutlined';
import IconButton from '@mui/material/IconButton';

import Logo from 'components/Logo';
import Onboarding from 'components/Onboarding';
import useAuth from 'hooks/useAuth';
import useRootstrapAuth from 'hooks/useRootstrapAuth';
import useTranslation from 'hooks/useTranslation';

import './styles.css';

const PageWrapper = ({ title, subtitle, children }) => {
  const { authenticated, wasOnboardingShown } = useAuth();
  const { isRootstrapDomain } = useRootstrapAuth();
  const t = useTranslation();

  const showOnboardingFirstTime = authenticated && !wasOnboardingShown && isRootstrapDomain;
  const [showOnboarding, setOnboardingShown] = useState(false);

  const handleOpenModal = () => setOnboardingShown(true);
  const handleCloseModal = () => setOnboardingShown(false);

  return (
    <div className="page-container">
      <div className="open-onboarding-icon">
        <IconButton onClick={handleOpenModal} aria-label={t('comments.editComment')}>
          <QuestionMarkIcon htmlColor="white" fontSize="large" />
        </IconButton>
      </div>
      <Logo />
      <div className="titles-container">
        {title && <h1 className="page-title">{title}</h1>}
        {subtitle && <h3>{subtitle}</h3>}
      </div>
      {(showOnboarding || showOnboardingFirstTime) && (
        <Onboarding handleCloseModal={handleCloseModal} />
      )}
      {children}
    </div>
  );
};

export default PageWrapper;
