import Modal from '@mui/material/Modal';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import Button from 'components/common/Button';
import useTranslation from 'hooks/useTranslation';
import routesPaths from 'routes/routesPaths';
import { setOnboardingShown } from 'state/actions/userActions';

import './styles.css';

const Onboarding = ({ handleCloseModal }) => {
  const t = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const changeOnboardingShown = () => {
    dispatch(setOnboardingShown());
    handleCloseModal();
  };

  const handleGoToRules = async () => {
    await changeOnboardingShown();
    navigate(routesPaths.rules);
  };

  return (
    <Modal open>
      <div className="onboarding-modal-container">
        <h1 className="onboarding-modal-title">{t('onboarding.title')}</h1>
        <p>
          {t('onboarding.intro')}
          <span className="bold-text">{t('onboarding.wordle')}</span>. {t('onboarding.canJoin')}
          <a
            href="https://rootstrap.slack.com/archives/C02U49H0VJA"
            target="_blank"
            rel="noreferrer"
            className="onboarding-link"
          >
            #{t('onboarding.wordle')}
          </a>
          {t('onboarding.slackChannel')}
        </p>
        <p>
          {t('onboarding.newPlayer')}
          <button className="rules-button" onClick={handleGoToRules}>
            {t('onboarding.checkRules')}
          </button>
          {t('onboarding.howItWorks')}
        </p>
        <p>
          {t('onboarding.alreadyPlayer')}
          <a
            href="https://rootstrap.slack.com/archives/C02U49H0VJA"
            target="_blank"
            rel="noreferrer"
            className="onboarding-link"
          >
            #{t('onboarding.wordle')}
          </a>
          {t('onboarding.slackChannel')}
        </p>
        <p>{t('onboarding.encouragingMessage')}</p>
        <Button handleClick={changeOnboardingShown}>{t('onboarding.startFun')}</Button>
      </div>
    </Modal>
  );
};

export default Onboarding;
