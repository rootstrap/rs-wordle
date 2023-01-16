import cn from 'classnames';

import { MAX_ATTEMPTS } from 'constants/constants';

import './styles.css';

const HorizontalBarChart = ({ data, maxValue, title, isWords = false }) => (
  <div className="bar-chart-container ">
    <h2 className="bar-chart-title">{title}</h2>
    {data.map((value, index) => {
      const isLostRow = index === MAX_ATTEMPTS && !isWords;
      let numericValue = value;
      let displayValue;
      let key = index;
      let isLongValue = false;
      if (typeof value !== 'number') {
        isLongValue = true;
        numericValue = value[1];
        displayValue = value[0];
        key = value[0];
      }
      const widthPercentage = (numericValue * 100) / maxValue ?? 10;

      return (
        <div className="bar-container" key={key}>
          <span className="font-frijole bar-chart-position">{isLostRow ? 'X' : index + 1}</span>
          <div className="bar-chart-value-container">
            <div
              className={cn('font-caveat-brush bar-chart-value', { isLostRow, isLongValue })}
              style={{ width: widthPercentage ? `${widthPercentage}%` : 'fit-content' }}
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
