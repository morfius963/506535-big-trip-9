import {makeFirstSymUp} from '../utils.js';
import AbstractComponent from './abstract-component.js';

class Menu extends AbstractComponent {
  constructor(menuValue) {
    super();
    this._menuValue = menuValue;
  }

  getTemplate() {
    return `<nav class="trip-controls__trip-tabs  trip-tabs">
      ${this._menuValue.map(({name, isActive}) => `<a class="trip-tabs__btn ${isActive ? `trip-tabs__btn--active` : ``}" href="#" data-switch="${name}">${makeFirstSymUp(name)}</a>`).join(``)}
    </nav>`;
  }
}

export default Menu;
