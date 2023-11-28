const ReviewReminiscing = () => (
  <div className="flex flex-col w-[60.25rem] gap-6">
    <textarea
      className="w-[60.25rem] h-[31.438rem] p-6 border border-transparent-green placeholder:text-center placeholder:font-bold outline-transparent-green rounded-md resize-none"
      placeholder={
        '\n\n\n\n\n\n여러분의 스프린트를 회고해 보세요' +
        '\n태스크를 잘 마무리했나요?' +
        '\n어떤 부분이 미비했나요?' +
        '\n스프린트 진행에 부족했던 점은 무엇인가요?'
      }
    />
    <div className="flex justify-end">
      <button className="px-4 py-1.5 rounded-md bg-starbucks-green text-true-white">작성하기</button>
    </div>
  </div>
);

export default ReviewReminiscing;
