// unit 테스트 하기!
const diffBetweenDate = (start: string, end: string) => {
  const startDate = new Date(start).toDateString();
  const endDate = new Date(end).toDateString();
  return Math.ceil(
    (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
  );
};

export default diffBetweenDate;
