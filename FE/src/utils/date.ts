const transformDate = (date: string) => {
  const newDate = new Date(date);
  const year = newDate.getFullYear();
  const month = (newDate.getMonth() + 1).toString().padStart(2, '0');
  const day = newDate.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const calculateRestDate = (startDate: string, endDate: string) =>
  (Number(new Date(endDate)) - Number(new Date(startDate))) / (24 * 60 * 60 * 1000);

export { transformDate, calculateRestDate };
