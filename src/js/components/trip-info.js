import {createElement} from '../utils.js';
import {removeElem} from '../utils.js';

const BIG_SEPARATOR = ` &mdash; ... &mdash; `;
const SMALL_SEPARATOR = ` &mdash; `;

class TripInfo {
  constructor({cities, date: {start, end}}) {
    this._cities = cities;
    this._dateStart = start;
    this._dateEnd = end;
    this._element = null;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    removeElem(this._element);
    this._element = null;
  }

  getTemplate() {
    return `<div class="trip-info__main">
    <h1 class="trip-info__title">${this._cities.length > 3
    ? `${this._cities[0]}${BIG_SEPARATOR}${this._cities[this._cities.length - 1]}`
    : `${this._cities.join(SMALL_SEPARATOR)}`}</h1>

    <p class="trip-info__dates">${this._dateStart}&nbsp;&mdash;&nbsp;${this._dateEnd}</p>
  </div>`;
  }
}

export default TripInfo;
