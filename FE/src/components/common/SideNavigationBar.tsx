import { NavigationInformation } from '../../types/navigation';
import NavigationButton from './NavigationButton';
import lesserLogo from '../../assets/icons/lesserLogo.svg';
import { Link, useLocation } from 'react-router-dom';
import useLogout from '../../hooks/pages/useLogout';

const navigationInformation: NavigationInformation[] = [
  {
    pageName: '백로그',
    pageURI: (projectId) => `/projects/${projectId}/backlog`,
    description: '프로젝트에 포함되어야 하는 기능의 우선순위 목록을 에픽, 스토리, 태스크 단위로 나누어 설정할 수 있다.',
  },
  {
    pageName: '스프린트',
    pageURI: (projectId) => `/projects/${projectId}/sprint`,
    description:
      '기능들을 구현하는 작업의 단위로, 목표와 기간을 설정할 수 있고 드래그 앤 드롭을 이용해 업무를 관리할 수 있다.',
  },
  {
    pageName: '회고',
    pageURI: (projectId) => `/projects/${projectId}/review`,
    description:
      '완료된 스프린트의 성과를 확인하고 번다운 차트를 통해 분석할 수 있다. 또한 회고란을 통해 개선점을 도출할 수 있다.',
  },
];

const SideNavigationBar = () => {
  const currentURI = useLocation().pathname;
  const handleLogoutButtonClick = useLogout();

  return (
    <nav className="flex flex-col items-center px-6 py-8 top-[32px] rounded-lg w-52 bg-house-green gap-2.5 mr-10 min-w-[13.125rem] min-h-[calc(100vh-64px)] max-h-[calc(100vh-64px)] sticky">
      <Link to={'/projects'} className="mb-5">
        <img src={lesserLogo} alt="로고" />
        <p className="text-xs font-medium text-center text-true-white">적고 쉽고 애자일하게 일하자</p>
      </Link>
      <hr className="w-full h-px bg-true-white" />
      <ul>
        {navigationInformation.map(({ pageName, description, pageURI }) => (
          <li key={pageName} className="max-w-[10rem]">
            <NavigationButton pageName={pageName} description={description} pageURI={pageURI} currentURI={currentURI} />
          </li>
        ))}
      </ul>
      <Link to={'projects'} className="py-3 text-lg font-bold text-true-white">
        내 프로젝트
      </Link>
      <button className="py-3 text-lg font-bold text-true-white" onClick={handleLogoutButtonClick}>
        로그아웃
      </button>
    </nav>
  );
};

export default SideNavigationBar;
