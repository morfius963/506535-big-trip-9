import Sort from './sort.js';
import TripContent from './trip-content.js';
import TripItemContent from './trip-item-content.js';
import TripDayInfo from './trip-day-info.js';
import EventsList from './events-list.js';
import Event from './event.js';
import EventEdit from './edit-event.js';
import NoPoints from './no-points.js';
import moment from 'moment';
import {renderElement, unrenderElement} from '../utils.js';

class TripController {
  constructor(container, trips) {
    this._container = container;
    this._trips = trips.slice().sort((a, b) => a.eventTime.from - b.eventTime.from);
    this._sort = new Sort();
    this._tripContent = new TripContent();
    this._noPoints = new NoPoints();
  }

  init() {
    if (this._trips.length === 0) {
      renderElement(this._container, this._noPoints.getElement(), `beforeend`);
      return;
    }

    renderElement(this._container, this._sort.getElement(), `beforeend`);
    this._renderEventsByDay();

    this._sort.getElement().addEventListener(`change`, (evt) => this._onSortListClick(evt));
  }

  _renderEventsByDay() {
    const fromDates = this._trips.map(({eventTime: {from}}) => from).sort((a, b) => a - b);
    const formattedDates = fromDates.map((date) => moment(date).format(`MMM DD`));
    const uniqueFromDates = [...new Set(formattedDates)];

    renderElement(this._container, this._tripContent.getElement(), `beforeend`);

    uniqueFromDates.forEach((eventDate, i) => {
      const tripItemContent = new TripItemContent();
      const tripDayInfo = new TripDayInfo();
      const eventsList = new EventsList();
      const tripsForOneDay = this._trips.filter(({eventTime: {from}}) => moment(from).format(`MMM DD`) === eventDate);
      const stringToObjDate = new Date(`${eventDate} ${moment(Date.now()).format(`YYYY`)}`);

      renderElement(this._tripContent.getElement(), tripItemContent.getElement(), `beforeend`);
      renderElement(tripItemContent.getElement(), tripDayInfo.getElement(), `beforeend`);
      renderElement(tripItemContent.getElement(), eventsList.getElement(), `beforeend`);

      tripDayInfo.getElement().querySelector(`.day__counter`).textContent = i + 1;
      tripDayInfo.getElement().querySelector(`.day__date`).textContent = moment(stringToObjDate).format(`MMM DD`);
      tripDayInfo.getElement().querySelector(`.day__date`).value = moment(stringToObjDate).format(`YYYY-MM-DD`);

      tripsForOneDay.forEach((trip) => {
        this._renderEvent(eventsList.getElement(), trip);
      });
    });
  }

  _renderEvent(eventsContainer, eventData) {
    const eventItem = new Event(eventData);
    const eventEdit = new EventEdit(eventData);

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

  _clearAllTrips() {
    unrenderElement(this._tripContent.getElement());
    this._tripContent.removeElement();
  }

  _sortEventsByValue(list, fn) {
    const tripItemContent = new TripItemContent();
    const tripDayInfo = new TripDayInfo();
    const eventsList = new EventsList();
    const sortedTripsList = list.slice().sort(fn);

    this._clearAllTrips();

    renderElement(this._container, this._tripContent.getElement(), `beforeend`);
    renderElement(this._tripContent.getElement(), tripItemContent.getElement(), `beforeend`);
    renderElement(tripItemContent.getElement(), tripDayInfo.getElement(), `beforeend`);
    renderElement(tripItemContent.getElement(), eventsList.getElement(), `beforeend`);

    tripDayInfo.getElement().querySelector(`.day__counter`).textContent = ``;
    tripDayInfo.getElement().querySelector(`.day__date`).textContent = ``;
    tripDayInfo.getElement().querySelector(`.day__date`).value = ``;

    sortedTripsList.forEach((trip) => {
      this._renderEvent(eventsList.getElement(), trip);
    });
  }

  _onSortListClick(evt) {
    const sortEventsByTime = (a, b) => b.eventTime.activityTime - a.eventTime.activityTime;
    const sortEventsByPrice = (a, b) => b.cost - a.cost;

    switch (evt.target.dataset.sortType) {
      case `time`:
        this._sortEventsByValue(this._trips, sortEventsByTime);
        break;
      case `price`:
        this._sortEventsByValue(this._trips, sortEventsByPrice);
        break;
      case `default`:
        this._clearAllTrips();
        this._renderEventsByDay();
        break;
    }
  }
}

export default TripController;
