interface CreateProcessTextProps {
  processNum: number;
  processName: string;
  active: boolean;
}

const CreateProcessText = ({ processNum, processName, active }: CreateProcessTextProps) => {
  return (
    <div className="flex gap-2 items-center">
      <div
        className={`${active ? 'bg-starbucks-green' : 'bg-light-gray'} w-6 h-6 rounded-xl flex flex-col justify-center`}
      >
        <p className="font-pretendard text-true-white text-s font-bold text-center">{processNum}</p>
      </div>
      <p className={`font-pretendard font-bold text-ml ${active ? 'text-true-black' : 'text-light-gray'}`}>
        {processName}
      </p>
    </div>
  );
};

export default CreateProcessText;
