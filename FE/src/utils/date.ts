const transformDate = (date: string) => {
  const newDate = new Date(date);
  const year = newDate.getFullYear();
  const month = (newDate.getMonth() + 1).toString().padStart(2, '0');
  const day = newDate.getDay().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export { transformDate };
