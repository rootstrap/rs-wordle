import { MAIN_ID, SKIP_TO_MAIN_CONTENT_ID } from 'constants/componentsIds';

import './styles.css';

const SkipToMainContent = () => (
  <a href={`#${MAIN_ID}`} id={SKIP_TO_MAIN_CONTENT_ID} className="skipToMainContent">
    Skip To Main Content
  </a>
);

export default SkipToMainContent;
