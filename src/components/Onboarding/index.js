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
    <Modal open={true}>
      <div className="onboarding-modal-container">
        <h1 className="onboarding-modal-title">Welcome to RS WORDLE!</h1>
        <p>
          This is Rootstrap's implementation of the world famous game{' '}
          <span className="bold-text">wordle</span>. You can join the{' '}
          <a
            href="https://rootstrap.slack.com/archives/C02U49H0VJA"
            target="_blank"
            rel="noreferrer"
            className="onboarding-link"
          >
            #wordle
          </a>{' '}
          channel on Slack.
        </p>
        <p>
          If it is your first time here, please{' '}
          <button className="rules-button" onClick={handleGoToRules}>
            check out the rules
          </button>{' '}
          to see how it works.
        </p>
        <p>
          If you where already a player and you are experiencing some weird behavior, we recommend
          you logout and login again. If this doesn't work please bring the issue to the{' '}
          <a
            href="https://rootstrap.slack.com/archives/C02U49H0VJA"
            target="_blank"
            rel="noreferrer"
            className="onboarding-link"
          >
            #wordle
          </a>{' '}
          channel on Slack.
        </p>
        <p>The most important thing, have fun! And let the competition begin 💪🏼</p>
        <Button handleClick={changeOnboardingShown}>Start the fun!</Button>
      </div>
    </Modal>
  );
};

export default Onboarding;
