import { useNavigate } from 'react-router-dom';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

import Input from 'components/common/Input';
import ListRow from 'components/common/ListRow';
import useTranslation from 'hooks/useTranslation';
import useUsers from 'hooks/useUsers';

import './styles.css';

const Users = () => {
  const { filters, changeFilter, usersList } = useUsers();
  const { username } = filters;
  const navigate = useNavigate();

  const t = useTranslation();
  const filterByName = t('users.filterByName');

  return (
    <div className="users-container">
      <div className="users-filters-container">
        <span className="users-filter-label">{filterByName}</span>
        <Input value={username} handleOnChange={newValue => changeFilter('username', newValue)} />
      </div>
      <div className="users-list-container">
        {usersList?.map(({ email, id, name, photo }, index) => (
          <ListRow
            key={`${name}-${index}`}
            onClick={() =>
              navigate(`/statistics/${id}`, {
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
