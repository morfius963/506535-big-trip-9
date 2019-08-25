import SortList from './sort-list.js';
import TripContent from './trip-content.js';
import TripItemContent from './trip-item-content.js';
import TripDayInfo from './trip-day-info.js';
import EventsList from './events-list.js';
import Event from './event.js';
import EventEdit from './edit-event.js';
import NoPoints from './no-points.js';
import {renderElement} from '../utils.js';

class TripController {
  constructor(container, trips) {
    this._container = container;
    this._trips = trips;
    this._sortList = new SortList();
    this._tripContent = new TripContent();
    this._tripItemContent = new TripItemContent();
    this._tripDayInfo = new TripDayInfo();
    this._eventsList = new EventsList();
    this._noPoints = new NoPoints();
  }

  init() {
    if (this._trips.length === 0) {
      renderElement(this._container, this._noPoints.getElement(), `beforeend`);
      return;
    }

    renderElement(this._container, this._sortList.getElement(), `beforeend`);
    renderElement(this._container, this._tripContent.getElement(), `beforeend`);
    renderElement(this._tripContent.getElement(), this._tripItemContent.getElement(), `beforeend`);
    renderElement(this._tripItemContent.getElement(), this._tripDayInfo.getElement(), `beforeend`);
    renderElement(this._tripItemContent.getElement(), this._eventsList.getElement(), `beforeend`);

    this._trips.forEach((eventItem) => {
      this._renderEvent(eventItem);
    });

    this._sortList.getElement().addEventListener(`change`, (evt) => this._onSortListClick(evt));
  }

  _renderEvent(eventData) {
    const eventItem = new Event(eventData);
    const eventEdit = new EventEdit(eventData);
    const eventsContainer = this._eventsList.getElement();

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        eventsContainer.replaceChild(eventItem.getElement(), eventEdit.getElement());
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    eventItem.getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, () => {
        eventsContainer.replaceChild(eventEdit.getElement(), eventItem.getElement());
        document.addEventListener(`keydown`, onEscKeyDown);
      });

    eventEdit.getElement()
    .querySelector(`.event__rollup-btn`)
    .addEventListener(`click`, () => {
      eventsContainer.replaceChild(eventItem.getElement(), eventEdit.getElement());
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

    eventEdit.getElement()
      .querySelector(`.event--edit`)
      .addEventListener(`submit`, (evt) => {
        evt.preventDefault();
        eventsContainer.replaceChild(eventItem.getElement(), eventEdit.getElement());
        document.removeEventListener(`keydown`, onEscKeyDown);
      });

    renderElement(eventsContainer, eventItem.getElement(), `beforeend`);
  }

  _onSortListClick(evt) {
    this._eventsList.getElement().innerHTML = ``;

    let sortedEvents = this._trips;

    switch (evt.target.dataset.sortType) {
      case `time`:
        const sortedEventsByTime = this._trips.slice().sort((a, b) => a.eventTime.activityTime - b.eventTime.activityTime);
        sortedEvents = sortedEventsByTime;
        break;
      case `price`:
        const sortedEventsByPrice = this._trips.slice().sort((a, b) => a.cost - b.cost);
        sortedEvents = sortedEventsByPrice;
        break;
      case `default`:
        sortedEvents = this._trips.slice();
        break;
    }

    sortedEvents.forEach((tripMock) => this._renderEvent(tripMock));
  }
}

export default TripController;
