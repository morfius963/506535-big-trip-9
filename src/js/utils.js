export const sortEventsByTime = (a, b) => a.eventTime.activityTime - b.eventTime.activityTime;

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

export const formattedDate = (ts, value = `date`) => {
  const date = new Date(ts);

  if (value === `date`) {
    const year = date.getFullYear() - 2000;
    const month = String(date.getMonth() + 1).padStart(2, `0`);
    const day = String(date.getDate()).padStart(2, `0`);

    return `${day}/${month}/${year}`;

  } else {
    const hour = String(date.getHours()).padStart(2, `0`);
    const minute = String(date.getMinutes()).padStart(2, `0`);

    return `${hour}:${minute}`;
  }
};

export const formattedTimeDifference = (ts) => {
  const minutesFromMs = Math.floor((ts) / (1000 * 60));

  const minutes = minutesFromMs % 60;
  const formattedMinutes = String(minutes).padStart(2, `0`);

  const hours = ((minutesFromMs - minutes) / 60) % 24;
  const formattedHours = String(hours).padStart(2, `0`);

  const days = Math.floor(((minutesFromMs - minutes) / 60) / 24);
  const formattedDays = String(days).padStart(2, `0`);

  const minutesPart = `${formattedMinutes}M`;
  const hoursPart = hours > 0 || days > 0 ? `${formattedHours}H` : ``;
  const daysPart = days > 0 ? `${formattedDays}D` : ``;

  return `${daysPart} ${hoursPart} ${minutesPart}`;
};

export const POSITION = {
  afterbegin: `afterbegin`,
  beforeend: `beforeend`,
  afterend: `afterend`
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

export const renderElement = (container, element, place) => {
  switch (place) {
    case POSITION.afterbegin:
      container.prepend(element);
      break;
    case POSITION.beforeend:
      container.append(element);
      break;
    case POSITION.afterend:
      container.after(element);
      break;
  }
};

export const removeElem = (element) => {
  if (element) {
    element.remove();
  }
};
