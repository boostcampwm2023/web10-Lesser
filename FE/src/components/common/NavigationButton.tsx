import { Link } from 'react-router-dom';
import { NavigationInformation } from '../../types/navigation';

interface NavigationButtonProps extends NavigationInformation {
  currentURI: string;
}

const NavigationButton = ({ pageName, description, pageURI, currentURI }: NavigationButtonProps) => {
  const sameURL = currentURI === pageURI;

  return (
    <Link
      to={pageURI}
      className={`flex flex-col items-center gap-2.5 ${sameURL ? 'bg-true-white py-3 px-5 rounded-lg h-40' : 'py-3'}`}
    >
      <p className={`text-lg font-bold ${sameURL ? 'text-house-green' : 'text-true-white'}`}>{pageName}</p>
      {sameURL && <p className="text-xs font-medium text-house-green">{description}</p>}
    </Link>
  );
};

export default NavigationButton;
