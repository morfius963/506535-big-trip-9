import AbstractComponent from "./abstract-component.js";

class EventsList extends AbstractComponent {
  getTemplate() {
    return `<ul class="trip-events__list"></ul>`;
  }
}

export default EventsList;
