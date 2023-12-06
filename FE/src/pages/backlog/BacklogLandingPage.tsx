import backlogLanding from '../../assets/images/backlog-landing.png';

const BacklogLandingPage = () => {
  const linearGradientStyle = {
    background: `linear-gradient(
        to bottom,
        rgba(249, 249, 249, 0) 10%,
        rgba(249, 249, 249, 0.25) 25%,
        rgba(249, 249, 249, 0.5) 50%,
        rgba(249, 249, 249, 0.75) 75%,
        rgba(249, 249, 249, 1) 100%
      ),
    url(${backlogLanding})`,
  };
  return (
    <main className="w-[60.25rem]">
      <div className="flex justify-between">
        <div className="flex flex-col w-[28.938rem] gap-6 mt-32 mb-24 text-r">
          <p className="font-bold text-l text-house-green">백로그</p>
          <p>백로그는 프로젝트에 포함되어야 하는 기능의 우선순위 목록을 나타냅니다.</p>
          <p>
            백로그를 만들 때는 다음과 같은 항목들을 고려합니다.
            <br />
            <br />
            <span className="font-bold">• 에픽(Epic):</span> 에픽은 큰 규모의 작업 또는 목표를 나타내는 키워드입니다.
            예를 들어, "사용자 인터페이스 개선"이나 "보안 강화"와 같은 주제로 이루어진 큰 작업들이 에픽으로 정의될 수
            있습니다.
            <br />
            <br />
            <span className="font-bold">• 스토리(Story):</span> 스토리는 에픽을 더 작은 작업 단위로 나눈 키워드입니다.
            스토리는 사용자 관점에서 기능을 설명합니다. 예를 들어, "사용자가 로그인할 때 이메일과 비밀번호를 입력할 수
            있어야 한다"와 같은 주제로 이루어진 작업들이 스토리로 정의될 수 있습니다.
            <br />
            <br />
            <span className="font-bold">• 태스크(Task):</span> 태스크는 스토리를 실제로 완료하기 위해 필요한 세부
            작업들을 나타내는 키워드입니다. 예를 들어, "로그인 기능 구현", "데이터베이스 연동", "인증 로직 개발"과 같은
            세부 작업들이 태스크로 정의될 수 있습니다.
            <br />
          </p>
        </div>

        <div className="w-[450px] h-[550px] self-end" style={linearGradientStyle}></div>
      </div>
      <button className="w-[60.25rem] h-[2.375rem] rounded-md bg-starbucks-green font-bold text-ml text-true-white">
        백로그 생성하기
      </button>
    </main>
  );
};

export default BacklogLandingPage;
