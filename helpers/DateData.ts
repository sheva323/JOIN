import moment from "moment";


export const getUnixTimestampsForToday = (): [number, number] => {
  const today = moment().startOf("day");
  const startOfDay = today.unix();
  const endOfDay = today.endOf("day").unix();
  return [startOfDay, endOfDay];
};
export const getUnixTimestampsForThisWeek = (): [number, number] => {
  const startOfWeek = moment().startOf('week');
  const endOfWeek = moment().endOf('week');
  const startOfWeekUnix = startOfWeek.unix();
  const endOfWeekUnix = endOfWeek.unix();
  return [startOfWeekUnix, endOfWeekUnix];
};
export const getUnixTimestampsForWeekend = (): [number, number] => {
  const startOfWeekend = moment().startOf('week').add(5, 'days');
  const endOfWeekend = moment().startOf('week').add(6, 'days').endOf('day');
  const startOfWeekendUnix = startOfWeekend.unix();
  const endOfWeekendUnix = endOfWeekend.unix();
  return [startOfWeekendUnix, endOfWeekendUnix];
};

export const GetDataFormatted = (unix: number) => {
  const timestampInMilliseconds = unix * 1000;
  const date = new Date(timestampInMilliseconds);
  const formattedData = getDateFormat(date);
  return formattedData;
};
const getDateFormat = (_date: Date) => {
  const date = _date.getDate();
  const month = _date.getMonth() + 1;
  const fullYear = _date.getFullYear();
  const hours = _date.getHours();
  const minutes = _date.getMinutes();
  return `${formatter(month)}/${formatter(date)}/${formatter(
    fullYear
  )} ${formatter(hours)}:${formatter(minutes)}`;
};
const formatter = (_data: number) => {
  return _data < 10 ? `0${_data}` : `${_data}`;
};