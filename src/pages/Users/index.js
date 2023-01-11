import { useHistory } from 'react-router-dom';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

import ListRow from 'components/common/ListRow';
import useUsers from 'hooks/useUsers';

import './styles.css';

const Users = () => {
  const { filters, changeFilter, usersList } = useUsers();
  const { username } = filters;
  const { push } = useHistory();

  return (
    <div className="users-container">
      <div className="users-filters-container">
        <span className="users-filter-label">Filter by name</span>
        <input
          className="users-filter-input"
          type="text"
          value={username}
          onChange={({ target: { value: newValue } }) => changeFilter('username', newValue)}
        />
      </div>
      <div className="users-list-container">
        {usersList?.map(({ email, id, name, photo }, index) => (
          <ListRow
            key={`${name}-${index}`}
            onClick={() =>
              push({
                pathname: `/statistics/${id}`,
                state: { email, name, photo },
              })
            }
            name={name}
            photo={photo}
            icon={<KeyboardArrowRightIcon />}
            showIcon
          />
        ))}
      </div>
    </div>
  );
};

export default Users;
