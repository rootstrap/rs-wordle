import './styles.css';
import { FaGithub } from 'react-icons/fa';

const GithubIconAnchor = ({ repoId, description }) => {
  const githuburl = `https://github.com/${repoId}`;
  return (
    <a href={githuburl} target="_blank" rel="noopener noreferrer">
      <FaGithub />
    </a>
  );
};

export default GithubIconAnchor;
