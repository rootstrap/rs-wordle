import './styles.css';

const StatBox = ({ label, value }) => (
  <div className="stat-box">
    <span className="font-caveat-brush stat-value">{value}</span>
    <br />
    <span className="font-frijole stat-label">{label}</span>
  </div>
);

export default StatBox;
