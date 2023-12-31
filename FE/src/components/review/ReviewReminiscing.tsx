import { Data } from '../../types/review';
import { useEffect, useState } from 'react';
import useReminiscing from './../../hooks/pages/review/useReminiscing';

interface ReviewReminiscingProps {
  data: Data;
}

const ReviewReminiscing = ({ data }: ReviewReminiscingProps) => {
  const { selectedSprint: sprint } = data ?? {};
  const [editTextarea, setEditTextarea] = useState<boolean>(false);
  const initialReminiscing = data && sprint.reminiscing ? sprint.reminiscing.content : '';
  const [reminiscing, setReminiscing] = useState<string>('');
  const handleEditButtonClick = () => {
    if (!data) {
      return;
    }
    setEditTextarea(!editTextarea);
    setReminiscing(initialReminiscing);
  };

  useEffect(() => {
    setReminiscing(initialReminiscing);
  }, [initialReminiscing]);

  const { handleConfirmButtonClick } = useReminiscing(sprint, reminiscing, setEditTextarea);
  const buttonName = initialReminiscing ? '수정하기' : '작성하기';
  const placeholder = data
    ? `${'\n'.repeat(
        7,
      )}여러분의 스프린트를 회고해 보세요\n태스크를 잘 마무리했나요?\n어떤 부분이 미비했나요?\n스프린트 진행에 부족했던 점은 무엇인가요?`
    : `${'\n'.repeat(7)}완료된 스프린트가 없습니다`;

  return (
    <form className="flex flex-col w-[60.25rem] gap-6" onSubmit={handleConfirmButtonClick}>
      <textarea
        className="w-[60.25rem] h-[31.438rem] p-6 border border-transparent-green placeholder:text-center placeholder:font-bold outline-transparent-green rounded-md resize-none"
        placeholder={placeholder}
        value={reminiscing}
        onChange={(e) => {
          setReminiscing(e.target.value);
        }}
        disabled={!editTextarea || !data}
      />
      <div className="flex justify-end">
        {editTextarea ? (
          <div className="flex gap-2">
            <button
              className="px-4 py-1.5 rounded-md outline outline-1 bg-true-white text-starbucks-green"
              onClick={handleEditButtonClick}
            >
              {'취소'}
            </button>
            <button type="submit" className="px-4 py-1.5 rounded-md bg-starbucks-green text-true-white">
              {'확인'}
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="px-4 py-1.5 rounded-md bg-starbucks-green text-true-white"
            onClick={handleEditButtonClick}
          >
            {buttonName}
          </button>
        )}
      </div>
    </form>
  );
};

export default ReviewReminiscing;
