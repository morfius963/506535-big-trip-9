const bigSeparator = ` &mdash; ... &mdash; `;
const smallSeparator = ` &mdash; `;

export const makeTripInfoTemplate = ({cities, date: {start, end}}) => (
  `<div class="trip-info__main">
    <h1 class="trip-info__title">${cities.length > 3
    ? `${cities[0]}${bigSeparator}${cities[cities.length - 1]}`
    : `${cities.join(smallSeparator)}`}</h1>

    <p class="trip-info__dates">${start}&nbsp;&mdash;&nbsp;${end}</p>
  </div>`
);
