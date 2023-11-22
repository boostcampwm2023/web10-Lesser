import { NavigationInformation } from '../../types/navigation';

interface NavigationButtonProps extends NavigationInformation {
  currentURI: string;
}

const NavigationButton = ({ pageName, description, pageURI, currentURI }: NavigationButtonProps) => {
  const URIIsSame = currentURI === pageURI;

  return (
    <button
      className={`flex flex-col items-center gap-2.5 w-full ${
        URIIsSame ? 'bg-true-white py-3 px-5 rounded-lg' : 'py-3'
      }`}
    >
      <p className={`text-lg font-bold ${URIIsSame ? 'text-house-green' : 'text-true-white'}`}>{pageName}</p>
      {URIIsSame && <p className="text-xs font-medium text-house-green">{description}</p>}
    </button>
  );
};

export default NavigationButton;
