import {createElement} from '../utils.js';
import {removeElem} from '../utils.js';

class TripContent {
  constructor() {
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
    return `<ul class="trip-days"></ul>`;
  }
}

export default TripContent;
