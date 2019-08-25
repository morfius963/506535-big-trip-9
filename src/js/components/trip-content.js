import AbstractComponent from "./abstract-component.js";

class TripContent extends AbstractComponent {
  getTemplate() {
    return `<ul class="trip-days"></ul>`;
  }
}

export default TripContent;
