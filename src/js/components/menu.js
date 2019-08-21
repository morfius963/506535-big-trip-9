import {makeFirstSymUp} from '../utils.js';
import {createElement} from '../utils.js';
import {removeElem} from '../utils.js';

class Menu {
  constructor(menuValue) {
    this._menuValue = menuValue;
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
    return `<nav class="trip-controls__trip-tabs  trip-tabs">
      ${this._menuValue.map(({name, isActive}) => `<a class="trip-tabs__btn ${isActive ? `trip-tabs__btn--active` : ``}" href="#">${makeFirstSymUp(name)}</a>`).join(``)}
    </nav>`;
  }
}

export default Menu;
