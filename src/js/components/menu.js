import {makeFirstSymUp} from '../utils.js';

export const makeMenuTemplate = (menuValue) => (
  `<nav class="trip-controls__trip-tabs  trip-tabs">
    ${menuValue.map(({name, isActive}) => `<a class="trip-tabs__btn ${isActive ? `trip-tabs__btn--active` : ``}" href="#">${makeFirstSymUp(name)}</a>`).join(``)}
  </nav>`
);
