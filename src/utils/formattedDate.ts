export const formattedDate = (date: string): string => {
  const parsedDate = new Date(date);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = parsedDate.toLocaleDateString("en-GB", options);
  return formattedDate;
};
