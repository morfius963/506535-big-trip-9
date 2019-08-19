export const sortEventsByDate = (a, b) => a.eventTime.to.date > b.eventTime.to.date ? 1 : -1;

export const getRandomNum = (min, max) => Math.floor(min + Math.random() * (max + 1 - min));

export const makeFirstSymUp = (value) => `${value[0].toUpperCase()}${value.substring(1)}`;

export const getRandomArray = (arr, min, max) => {
  const sortedArray = arr.slice().sort(() => Math.random() - 0.5);
  const randomMax = getRandomNum(min, max);

  return sortedArray.slice(min, randomMax);
};

export const getFullEventPrice = (eventsList) => (
  eventsList.reduce((acc, {cost, offers}) => {
    const offerFullPrice = offers.reduce((accum, {price, isChecked}) => (isChecked ? accum + price : accum), 0);

    return acc + cost + offerFullPrice;
  }, 0)
);

export const generateDate = (isRandom = false) => {
  const timestamp = isRandom ? Date.now() + Math.round(Math.random() * 3 * 24 * 60 * 60 * 1000) : Date.now();

  return new Date(timestamp);
};

export const formattedDate = (date, value = `date`) => {
  if (value === `date`) {
    const year = date.getFullYear() - 2000;
    const month = date.getMonth() + 1 >= 10 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`;
    const day = date.getDate() >= 10 ? date.getDate() : `0${date.getDate()}`;

    return `${day}/${month}/${year}`;

  } else {
    const hour = date.getHours() >= 10 ? date.getHours() : `0${date.getHours()}`;
    const minute = date.getMinutes() >= 10 ? date.getMinutes() : `0${date.getMinutes()}`;

    return `${hour}:${minute}`;
  }
};

export const getTimeDifference = (ts1, ts2) => {
  const minutesFromMs = Math.floor((ts2 - ts1) / (1000 * 60));

  const minutes = minutesFromMs % 60;
  const formattedMinutes = minutes >= 10 ? minutes : `0${minutes}`;

  const hours = ((minutesFromMs - minutes) / 60) % 24;
  const formattedHours = hours >= 10 ? hours : `0${hours}`;

  const days = Math.floor(((minutesFromMs - minutes) / 60) / 24);
  const formattedDays = days >= 10 ? days : `0${days}`;

  const minutesPart = `${formattedMinutes}M`;
  const hoursPart = hours > 0 ? `${formattedHours}H` : ``;
  const daysPart = days > 0 ? `${formattedDays}D` : ``;

  return `${daysPart} ${hoursPart} ${minutesPart}`;
};
