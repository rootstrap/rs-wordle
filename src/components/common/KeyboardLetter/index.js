import './styles.css';

const KeyboardLetter = ({ value, color }) => (
  <div className="keyboard-letter" style={{ backgroundColor: color }}>
    <p className="letter-text">{value}</p>
  </div>
);

KeyboardLetter.propTypes = {};

export default KeyboardLetter;
