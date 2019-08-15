export const getRandomArray = (arr, min, max) => {
  const oldArray = arr.slice().sort(() => Math.random() - 0.5);
  const newArray = [];

  for (let i = 0; i < min + Math.floor(Math.random() * max); i++) {
    newArray.push(oldArray[i]);
  }

  return newArray;
};

export const getFullEventPrice = (eventsList) => (
  eventsList.reduce((acc, {cost, offers}) => {
    const offerFullPrice = offers.reduce((accum, {price, isChecked}) => (isChecked ? accum + price : accum), 0);

    return acc + cost + offerFullPrice;
  }, 0)
);

export const sortEventsByDate = (a, b) => a.eventTime.from.date > b.eventTime.from.date ? 1 : -1;

export const getRandomNum = (min, max) => Math.floor(min + Math.random() * (max + 1 - min));

export const makeFirstSymUp = (value) => `${value[0].toUpperCase()}${value.substring(1)}`;
