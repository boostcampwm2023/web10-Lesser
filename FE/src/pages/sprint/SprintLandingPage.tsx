import sprintLanding from '../../assets/images/sprint-landing.png';

const SprintLandingPage = () => {
  const linearGradientStyle = {
    background: `linear-gradient(
        to bottom,
        rgba(249, 249, 249, 0) 10%,
        rgba(249, 249, 249, 0.25) 25%,
        rgba(249, 249, 249, 0.5) 50%,
        rgba(249, 249, 249, 0.75) 75%,
        rgba(249, 249, 249, 1) 100%
      ),
    url(${sprintLanding})`,
  };
  return (
    <main className="w-[60.25rem]">
      <div className="flex justify-between">
        <div className="flex flex-col w-[28.938rem] gap-6 mt-32 mb-24 text-r">
          <p className="font-bold text-l text-house-green">스프린트</p>
          <p>
            스프린트는 백로그에서 우선순위에 따라 선택된 기능들을 실제로 구현하고 완료하는 작업의 단위를 나타내며,
            다음과 같은 절차로 진행됩니다:
          </p>
          <p>
            <span className="font-bold">1. 스프린트 계획:</span> 스프린트 동안 구현할 기능을 선택하고, 그에 따른
            우선순위를 결정합니다. 백로그 항목들을 스프린트 백로그로 이동시키며, 각 항목의 구현 방법과 소요 시간을
            계획합니다.
            <br />
            <br />
            <span className="font-bold">2. 스프린트 진행:</span> 계획된 기능들을 구현하고 테스트합니다. 개개인은 할당된
            작업에 집중하며, 주기적으로 진행 상황을 공유하고 협업합니다.
            <br />
            <br />
            <span className="font-bold">3. 데일리 스탠드업 미팅:</span> 매일 짧은 시간 동안 자신의 작업 내용, 진행 상황,
            그리고 어려운 점을 공유하며 필요한 협업이나 조정 사항을 논의합니다.
            <br />
            <br />
            <span className="font-bold">4. 스프린트 검토:</span> 개발된 기능들을 검토하고 피드백을 받습니다. 완료된
            기능들을 시연하며, 팀원들의 의견을 수렴하여 개선 방향을 결정합니다.
          </p>
        </div>

        <div className="w-[450px] h-[550px] self-end" style={linearGradientStyle}></div>
      </div>
      <button className="w-[60.25rem] h-[2.375rem] rounded-md bg-starbucks-green font-bold text-ml text-true-white">
        스프린트 생성하기
      </button>
    </main>
  );
};

export default SprintLandingPage;
