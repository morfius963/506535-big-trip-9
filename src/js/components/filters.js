import {makeFirstSymUp} from '../utils.js';
import {createElement} from '../utils.js';
import {removeElem} from '../utils.js';

class Filters {
  constructor(filters) {
    this._filters = filters;
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
    return `<form class="trip-filters" action="#" method="get">
      ${this._filters.map(({name, isChecked}) => `<div class="trip-filters__filter">
        <input id="filter-${name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${name}" ${isChecked ? `checked` : ``}>
        <label class="trip-filters__filter-label" for="filter-${name}">${makeFirstSymUp(name)}</label>
      </div>`).join(``)}

      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`;
  }
}

export default Filters;
