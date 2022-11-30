import './styles.css';

const HorizontalBarChart = ({ data, maxValue, title }) => (
  <div className="bar-chart-container ">
    <h2 className="bar-chart-title">{title}</h2>
    {data.map((value, index) => {
      let numericValue = value;
      let displayValue;
      let key = index;
      if (typeof value !== 'number') {
        numericValue = value[1];
        displayValue = value[0];
        key = value[0];
      }
      const widthPercentage = (numericValue * 100) / maxValue ?? 10;

      return (
        <div className="bar-container" key={key}>
          <span className="font-frijole bar-chart-position">{index + 1}</span>
          <div className="bar-chart-value-container">
            <div
              className="font-caveat-brush bar-chart-value"
              style={{ width: !!widthPercentage ? `${widthPercentage}%` : 'auto' }}
            >
              {numericValue}
            </div>
          </div>
          {!!displayValue && <span className="bar-chart-display-value">{displayValue}</span>}
        </div>
      );
    })}
  </div>
);

export default HorizontalBarChart;
