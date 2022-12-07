import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

import ListRow from 'components/common/ListRow';
import useUsers from 'hooks/useUsers';

import './styles.css';

const Users = () => {
  // TODO: add name filter
  const { /* setFilters, */ usersList } = useUsers();

  return (
    <div className="users">
      <h1 className="section-title">Users</h1>
      <div className="users-list-container">
        {usersList?.map(({ name, photo }, index) => (
          <ListRow
            key={`${name}-${index}`}
            onClick={() => console.log('TODO: Take me to users statistics')}
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
