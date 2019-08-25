import AbstractComponent from "./abstract-component.js";

class NoPoints extends AbstractComponent {
  getTemplate() {
    return `<p class="trip-events__msg">Click New Event to create your first point</p>`;
  }
}

export default NoPoints;
