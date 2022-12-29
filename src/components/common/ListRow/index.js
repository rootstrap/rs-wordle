import { useState } from 'react';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import cn from 'classnames';

import './styles.css';

const ListRow = ({
  classProps,
  onClick,
  disabled,
  expandedHeight,
  leftText,
  name,
  photo,
  rightText,
  icon,
  showIcon,
  suffix,
  children,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const expandedIcon = isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />;
  const handleExpansion = () => setIsExpanded(prevValue => !prevValue);
  const useExpansion = !!expandedHeight;

  return (
    <>
      <button
        className={cn('list-row-container', { ...classProps, isEnabled: !classProps?.isDisabled })}
        onClick={useExpansion ? handleExpansion : onClick}
        disabled={disabled}
      >
        <span className="list-row-left-text">{leftText}</span>
        <div className="list-row-user">
          <img src={photo} className="list-row-photo" alt={`user-${name}`} />
          <span className="list-row-name">{name}</span>
        </div>
        <span className="list-row-right-text">{rightText}</span>
        {suffix && <span className="list-row-suffix">{suffix}</span>}
        {showIcon && <div className="list-row-icon">{handleExpansion ? expandedIcon : icon}</div>}
      </button>
      <div
        className={cn('list-row-expanded-container', { isExpanded })}
        style={{
          height: isExpanded ? expandedHeight : 0,
        }}
      >
        {isExpanded && children}
      </div>
    </>
  );
};

export default ListRow;
