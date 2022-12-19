import loading from 'assets/loading.png';

import './styles.css';

const Loading = () => (
  <div className="loading-container">
    <img src={loading} className="loading-icon" alt="loading" />
  </div>
);

export default Loading;
