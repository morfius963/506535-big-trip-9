import AbstractComponent from "./abstract-component.js";

class TripItemContent extends AbstractComponent {
  getTemplate() {
    return `<li class="trip-days__item day"></li>`;
  }
}

export default TripItemContent;
