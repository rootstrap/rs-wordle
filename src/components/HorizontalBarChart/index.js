import './styles.css';

const HorizontalBarChart = ({ data, maxValue, title }) => (
  <div className="bar-chart-container ">
    <h2 className="bar-chart-title">{title}</h2>
    {data.map((value, index) => {
      let numericValue = value;
      let displayValue;
      if (typeof value !== 'number') {
        numericValue = value[1];
        displayValue = value[0];
      }
      const widthPercentage = (numericValue * 100) / maxValue ?? 10;

      return (
        <div className="bar-container" key={index}>
          <span className="font-frijole bar-chart-position">{index + 1}</span>
          <span
            className="font-caveat-brush bar-chart-value"
            style={{ width: !!widthPercentage ? `${widthPercentage}%` : 'auto' }}
          >
            {numericValue}
          </span>
          {!!displayValue && <span className="bar-chart-display-value">{displayValue}</span>}
        </div>
      );
    })}
  </div>
);

export default HorizontalBarChart;
