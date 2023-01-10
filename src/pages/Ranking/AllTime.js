import ListRow from 'components/common/ListRow';
import Select from 'components/common/Select';
import { RANKING_VALUES } from 'constants/types';
import useRankingData from 'hooks/useRankingData';

import './styles.css';

const AllTime = () => {
  const {
    currentUser,
    rankingData,
    selectedRanking,
    onChangeSelectedRanking,
    goToUsersStatistics,
  } = useRankingData();

  return (
    <>
      <Select options={RANKING_VALUES} onChange={onChangeSelectedRanking} value={selectedRanking} />
      {rankingData.map(({ position, rightText, suffix, user: { email, name, photo }, user }) => {
        const isCurrentUser = email === currentUser;

        return (
          <ListRow
            key={email}
            classProps={{ isCurrentUser }}
            name={name}
            photo={photo}
            leftText={position}
            rightText={rightText}
            suffix={suffix}
            showIcon={false}
            onClick={() => goToUsersStatistics(user)}
          />
        );
      })}
    </>
  );
};

export default AllTime;
