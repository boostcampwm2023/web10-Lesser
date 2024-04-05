// unit 테스트 하기!
const diffBetweenDate = (start: string, end: string) => {
  const startDate = new Date(start).toDateString();
  console.log(startDate);
  const endDate = new Date(end).toDateString();
  console.log(endDate);
  console.log(
    Math.ceil(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );
  return Math.ceil(
    (new Date(endDate).getTime() - new Date(startDate).getTime()) /
      (1000 * 60 * 60 * 24)
  );
};

diffBetweenDate("2024-03-06T12:00:00Z", "2024-03-06T14:01:24Z");

export default diffBetweenDate;
