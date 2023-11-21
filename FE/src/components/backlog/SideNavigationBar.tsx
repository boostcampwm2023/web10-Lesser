import lesserLogo from '../../assets/icons/lesserLogo.svg';

interface NavigationInformation {
  pageName: string;
  description?: string;
  pageURI: string;
}

interface NavigationButtonProps extends NavigationInformation {
  currentURI: string;
}

const navigationInformation: NavigationInformation[] = [
  {
    pageName: '백로그',
    pageURI: 'backlog',
    description:
      '백로그 페이지 설명. 백로그는 제품백로그와 스프린트 백로그가 있으며 에픽, 스토리, 태스크로 이루어진다.',
  },
  {
    pageName: '스프린트',
    pageURI: 'sprint',
    description:
      '스프린트 페이지 설명. 스프린트 시작하면 칸반보드를 확인할 수 있고, 드래그 앤 드롭을 이용해 티켓을 옮길 수 있다.',
  },
  {
    pageName: '회고',
    pageURI: 'retrospect',
    description: '회고하는 페이지 설명. 스프린트 백로그 태스트 상태 분석, 번다운 차트, 회고 글 작성 칸이 있을 예정',
  },
  {
    pageName: '내 프로젝트',
    pageURI: 'projects',
    description: '내 프로젝트를 볼 수 있는 페이지',
  },
];

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

const SideNavigationBar = () => {
  const currentURI = 'backlog';

  return (
    <nav className="flex flex-col items-center px-6 py-8 rounded-lg w-52 bg-house-green gap-2.5">
      <div className="mb-5">
        <img src={lesserLogo} alt="로고" />
        <p className="text-xs font-medium text-true-white">적고 쉽고 애자일하게 일하자</p>
      </div>
      <hr className="w-full h-px bg-true-white" />
      <ul>
        {navigationInformation.map(({ pageName, description, pageURI }) => (
          <li>
            <NavigationButton
              key={pageName}
              pageName={pageName}
              description={description}
              pageURI={pageURI}
              currentURI={currentURI}
            />
          </li>
        ))}
      </ul>
      <button className="py-3 text-lg font-bold text-true-white mb-44">로그아웃</button>
    </nav>
  );
};

export default SideNavigationBar;
