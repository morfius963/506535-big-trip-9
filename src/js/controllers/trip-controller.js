import Sort from "../components/sort.js";
import TripContent from "../components/trip-content.js";
import TripItemContent from "../components/trip-item-content.js";
import TripDayInfo from "../components/trip-day-info.js";
import EventsList from "../components/events-list.js";
import NoPoints from "../components/no-points.js";
import PointController, {Mode as PointControllerMode} from "./point-controller.js";
import PageDataController from "./page-data-controller.js";
import moment from "moment";
import {renderElement, unrenderElement, getDateDiff} from "../utils.js";

class TripController {
  constructor(container, trips, onDataChange, isFiltered = false) {
    this._container = container;
    this._trips = this._sortByDefault(trips);
    this._onDataChangeMain = onDataChange;
    this._isFiltered = isFiltered;

    this._sort = new Sort();
    this._tripContent = new TripContent();
    this._noPoints = new NoPoints();
    this._pageDataController = new PageDataController();

    this._subscriptions = [];
    this._creatingPoint = null;

    this._onDataChange = this._onDataChange.bind(this);
    this.onChangeView = this.onChangeView.bind(this);

    this._sortEventsByTime = (a, b) => b.eventTime.activityTime - a.eventTime.activityTime;
    this._sortEventsByPrice = (a, b) => b.cost - a.cost;
  }

  init() {
    this._container.innerHTML = ``;

    if (this._trips.length === 0) {
      renderElement(this._container, this._noPoints.getElement(), `beforeend`);

      if (this._isFiltered) {
        this._noPoints.getElement().textContent = `No Results`;
      }

      return;
    }

    renderElement(this._container, this._sort.getElement(), `beforeend`);
    this._renderEventsByDay();
    this._sort.getElement().addEventListener(`change`, (evt) => this._onSortListClick(evt));
  }

  hide() {
    this._container.classList.add(`visually-hidden`);
  }

  show() {
    this._container.classList.remove(`visually-hidden`);
  }

  createTask() {
    let newPointContainer = this._container.querySelector(`.trip-events__list`);

    if (!newPointContainer) {
      this._createNewDay();
      newPointContainer = this._container.querySelector(`.trip-events__list`);
    }

    if (this._creatingPoint) {
      return;
    }

    const defaultPoint = {
      type: {
        value: ``,
        placeholder: ``
      },
      city: ``,
      images: new Array(6).fill(``).map(() => `${`http://picsum.photos/300/150?r=${Math.random()}`}`),
      description: ``,
      eventTime: {
        from: moment(Date.now()),
        to: moment(Date.now()),
        activityTime: 0
      },
      cost: 0,
      currency: `&euro;`,
      isFavorite: false,
      offers: []
    };

    this.onChangeView();
    this._creatingPoint = new PointController(newPointContainer, defaultPoint, PointControllerMode.ADDING, this.onChangeView, (...args) => {
      this._creatingPoint = null;
      this._onDataChange(...args);
    });
  }

  _createNewDay() {
    this._tripContent = new TripContent();
    const mainContainer = document.querySelector(`.trip-events`);
    const tripItemContent = new TripItemContent();
    const tripDayInfo = new TripDayInfo();
    const eventsList = new EventsList();

    mainContainer.innerHTML = ``;
    renderElement(mainContainer, this._tripContent.getElement(), `beforeend`);
    renderElement(this._tripContent.getElement(), tripItemContent.getElement(), `beforeend`);
    renderElement(tripItemContent.getElement(), tripDayInfo.getElement(), `beforeend`);
    renderElement(tripItemContent.getElement(), eventsList.getElement(), `beforeend`);
  }

  _renderEvent(eventsContainer, eventData) {
    const pointController = new PointController(eventsContainer, eventData, PointControllerMode.DEFAULT, this.onChangeView, this._onDataChange);
    this._subscriptions.push(pointController.setDefaultView.bind(pointController));
  }

  _onDataChange(newData, oldData) {
    const tripsIndex = this._trips.findIndex((it) => it === oldData);

    if (newData === null && oldData === null) {
      this._creatingPoint = null;
      this._renderBoard();
      return;

    } else if (newData === null) {
      this._trips = [...this._trips.slice(0, tripsIndex), ...this._trips.slice(tripsIndex + 1)];

    } else if (oldData === null) {
      this._trips = [newData, ...this._trips];

    } else {
      this._trips[tripsIndex] = newData;
    }

    this._creatingPoint = null;
    this._trips = this._sortByDefault(this._trips);
    this._onDataChangeMain(this._trips);
    this._pageDataController.updatePage(this._trips);
    this._renderBoard();
  }

  onChangeView() {
    const allPoints = this._container.querySelectorAll(`.trip-events__item`);

    this._subscriptions.forEach((subscription) => subscription());

    if (allPoints.length > this._trips.length) {
      unrenderElement(allPoints[0]);
      this._creatingPoint = null;
    }
  }

  _renderBoard() {
    if (this._trips.length === 0) {
      this._container.innerHTML = ``;
      renderElement(this._container, this._noPoints.getElement(), `beforeend`);
      return;
    }

    const currentSortValue = Array.from(this._sort.getElement().querySelectorAll(`.trip-sort__input`)).find((sortItem) => sortItem.checked).dataset.sortType;

    this._clearAllTrips();
    this._subscriptions.length = 0;
    renderElement(this._container, this._sort.getElement(), `beforeend`);

    switch (currentSortValue) {
      case `time`:
        this._sortEventsByValue(this._trips, this._sortEventsByTime);
        break;
      case `price`:
        this._sortEventsByValue(this._trips, this._sortEventsByPrice);
        break;
      case `default`:
        this._renderEventsByDay();
        break;
    }
  }

  _clearAllTrips() {
    unrenderElement(this._tripContent.getElement());
    this._tripContent.removeElement();
  }

  _renderEventsByDay() {
    const fromDates = this._trips.map(({eventTime: {from}}) => from).sort((a, b) => getDateDiff(a, b));
    const formattedDates = fromDates.map((date) => moment(date, `DD/MM/YY HH:mm`).format(`MMM DD`));
    const uniqueFormattedDates = [...new Set(formattedDates)];

    renderElement(this._container, this._tripContent.getElement(), `beforeend`);

    uniqueFormattedDates.forEach((eventDate, i) => {
      const tripItemContent = new TripItemContent();
      const tripDayInfo = new TripDayInfo();
      const eventsList = new EventsList();
      const tripsForOneDay = this._trips.filter(({eventTime: {from}}) => moment(from, `DD/MM/YY HH:mm`).format(`MMM DD`) === eventDate);
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

  _sortEventsByValue(list, fn) {
    const tripItemContent = new TripItemContent();
    const tripDayInfo = new TripDayInfo();
    const eventsList = new EventsList();
    const sortedTripsList = list.slice().sort(fn);

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
    this._clearAllTrips();

    switch (evt.target.dataset.sortType) {
      case `time`:
        this._sortEventsByValue(this._trips, this._sortEventsByTime);
        break;
      case `price`:
        this._sortEventsByValue(this._trips, this._sortEventsByPrice);
        break;
      case `default`:
        this._renderEventsByDay();
        break;
    }
  }

  _sortByDefault(trips) {
    return trips.slice().sort((a, b) => getDateDiff(a.eventTime.from, b.eventTime.from));
  }
}

export default TripController;
