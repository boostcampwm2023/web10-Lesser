import { NavigationInformation } from '../../types/navigation';
import NavigationButton from './NavigationButton';
import lesserLogo from '../../assets/icons/lesserLogo.svg';
import { Link, useLocation } from 'react-router-dom';
import useLogout from '../../hooks/useLogout';

const navigationInformation: NavigationInformation[] = [
  {
    pageName: '백로그',
    pageURI: '/backlog',
    description:
      '백로그 페이지 설명. 백로그는 제품백로그와 스프린트 백로그가 있으며 에픽, 스토리, 태스크로 이루어진다.',
  },
  {
    pageName: '스프린트',
    pageURI: '/sprint',
    description:
      '스프린트 페이지 설명. 스프린트 시작하면 칸반보드를 확인할 수 있고, 드래그 앤 드롭을 이용해 티켓을 옮길 수 있다.',
  },
  {
    pageName: '회고',
    pageURI: '/review',
    description: '회고하는 페이지 설명. 스프린트 백로그 태스트 상태 분석, 번다운 차트, 회고 글 작성 칸이 있을 예정',
  },
];

const SideNavigationBar = () => {
  const currentURI = useLocation().pathname;
  const handleLogoutButtonClick = useLogout();

  return (
    <nav className="flex flex-col items-center px-6 py-8 top-[32px] rounded-lg w-52 bg-house-green gap-2.5 mr-10 min-w-[13.125rem] min-h-[calc(100vh-64px)] max-h-[calc(100vh-64px)] sticky">
      <div className="mb-5">
        <img src={lesserLogo} alt="로고" />
        <p className="text-xs font-medium text-true-white">적고 쉽고 애자일하게 일하자</p>
      </div>
      <hr className="w-full h-px bg-true-white" />
      <ul>
        {navigationInformation.map(({ pageName, description, pageURI }) => (
          <li key={pageName} className="max-w-[10rem]">
            <NavigationButton pageName={pageName} description={description} pageURI={pageURI} currentURI={currentURI} />
          </li>
        ))}
      </ul>
      <Link to={'project'} className="py-3 text-lg font-bold text-true-white">
        내 프로젝트
      </Link>
      <button className="py-3 text-lg font-bold text-true-white" onClick={handleLogoutButtonClick}>
        로그아웃
      </button>
    </nav>
  );
};

export default SideNavigationBar;
