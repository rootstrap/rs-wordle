import { useRef, useState } from 'react';
import cn from 'classnames';

import './styles.css';

const Tabs = ({ tabsConfig, defaultIndex }) => {
  const [selectedIndex, setSelectedIndex] = useState(defaultIndex ?? 0);

  const handleClick = index => setSelectedIndex(index);

  const tabRefs = useRef({});

  const setIndex = index => {
    const tab = tabRefs.current[index];
    if (tab) {
      tab.focus();
    }
  };

  const onKeyDown = event => {
    const count = tabsConfig.length;
    const nextTab = () => setIndex((selectedIndex + 1) % count);
    const prevTab = () => setIndex((selectedIndex - 1 + count) % count);
    const firstTab = () => setIndex(0);
    const lastTab = () => setIndex(count - 1);

    const keyMap = {
      ArrowRight: nextTab,
      ArrowLeft: prevTab,
      Home: firstTab,
      End: lastTab,
    };

    const action = keyMap[event.key];

    if (action) {
      event.preventDefault();
      action();
    }
  };

  return (
    <div className="tabs-container">
      <div className="tab-list" role="tablist" aria-orientation="horizontal">
        {tabsConfig.map((tab, index) => {
          const isSelected = selectedIndex === index;

          return (
            <button
              key={`tab-${index}`}
              className={cn('tab', { isSelected })}
              onClick={() => handleClick(index)}
              role="tab"
              ref={element => (tabRefs.current[index] = element)}
              aria-controls={`panel-id-${index}`}
              aria-selected={isSelected}
              id={`tab-id-${index}`}
              onKeyDown={onKeyDown}
              onFocus={() => setSelectedIndex(index)}
              tabIndex={isSelected ? 0 : -1}
            >
              {tab.icon}
              {tab.label}
            </button>
          );
        })}
      </div>
      <div className="tabpanel-wrapper">
        {tabsConfig.map((tab, index) => (
          <section
            key={`tabpanel-${index}`}
            className="tab-panel"
            hidden={selectedIndex !== index}
            role="tabpanel"
            aria-labelledby={`tab-id${index}`}
            id={`panel-id-${index}`}
          >
            {tab.content}
          </section>
        ))}
      </div>
    </div>
  );
};

export default Tabs;
