import { Link } from 'react-router-dom';
import { NavigationInformation } from '../../types/navigation';
import { useSelectedProjectState } from '../../stores';

interface NavigationButtonProps extends NavigationInformation {
  currentURI: string;
}

const NavigationButton = ({ pageName, description, pageURI, currentURI }: NavigationButtonProps) => {
  const { id } = useSelectedProjectState();
  const isSameURL = () => {
    const currentUriList = currentURI.split('/');
    const pageUriList = pageURI(id).split('/');
    const currentUriLength = currentUriList.length;
    const pageUriLength = pageUriList.length;

    if (currentUriLength === pageUriLength && currentUriList[currentUriLength - 1] === pageUriList[pageUriLength - 1]) {
      return true;
    }

    return false;
  };

  return (
    <Link
      to={pageURI(id)}
      className={`flex flex-col items-center gap-2.5 ${
        isSameURL() ? 'bg-true-white py-3 px-5 rounded-lg h-40' : 'py-3'
      }`}
    >
      <p className={`text-lg font-bold ${isSameURL() ? 'text-house-green' : 'text-true-white'}`}>{pageName}</p>
      {isSameURL() && <p className="text-xs font-medium text-house-green">{description}</p>}
    </Link>
  );
};

export default NavigationButton;
