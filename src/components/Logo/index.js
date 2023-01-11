import wordleLogo from 'assets/wordleLogo.png';

import './styles.css';

const Logo = () => (
  <div className="rs-wordle-logo-container">
    <img src={wordleLogo} className="rs-wordle-logo" alt="RSWordle Logo" />
  </div>
);

export default Logo;
