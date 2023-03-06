import Button from 'components/common/Button';

import './styles.css';
import useDeveloperTools from './useDeveloperTools';

const DeveloperTools = () => {
  const {
    statisticsCheck,
    isLoading,
    selectedUsers,
    usersList,
    toggleSelectedUser,
    compareStatistics,
    clearStatisticsCheck,
    clearSelectedUsers,
    selectAllUsers,
  } = useDeveloperTools();

  return (
    <div className="developer-tools-container">
      <h1>Tool to help developers!</h1>
      <div className="developer-tools-users-container">
        <h2>USERS:</h2>
        <div className="developer-tools-users-list-container">
          {usersList?.map(({ email }) => (
            <div key={`users-${email}`}>
              <button onClick={() => toggleSelectedUser(email)}>{email} </button>
            </div>
          ))}
        </div>
        <h2>SELECTED:</h2>
        <div className="developer-tools-users-list-container">
          {selectedUsers?.map(email => (
            <div key={`selected-users-${email}`}>
              <button onClick={() => toggleSelectedUser(email)}>{email} </button>
            </div>
          ))}
        </div>
      </div>
      <div className="developer-tools-users-container">
        <div className="developer-tools-button-container">
          <Button handleClick={selectAllUsers}>Select All Users</Button>
        </div>
        <div className="developer-tools-button-container">
          <Button handleClick={clearSelectedUsers}>Clear Selected Users</Button>
        </div>
        <div className="developer-tools-button-container">
          <Button handleClick={clearStatisticsCheck}>Clear Statistics Check</Button>
        </div>
        <div className="developer-tools-button-container">
          <Button handleClick={compareStatistics}>Compare Statistics</Button>
        </div>
      </div>
      <div className="developer-tools-statistics-resutls">
        {isLoading ? (
          <h1>loading...</h1>
        ) : (
          <div>
            {statisticsCheck?.map(({ color, message, handleClickLink }) => (
              <div className="row-container" key={message}>
                <h3 style={{ color }}>{message}</h3>
                {!!handleClickLink && (
                  <button
                    className="developer-tools-update-statistics-link"
                    onClick={handleClickLink}
                  >
                    Update Statistics
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeveloperTools;
