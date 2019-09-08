import Menu from "./js/components/menu.js";
import Filters from "./js/components/filters.js";
import TripInfo from "./js/components/trip-info.js";
import TripController from "./js/controllers/trip-controller.js";
import Statistics from "./js/components/statistics.js";
import {eventsData, menuData, filtersData, tripInfoData} from "./js/data.js";
import {getFullEventPrice, renderElement} from "./js/utils.js";

const tripInfoContainer = document.querySelector(`.trip-main__trip-info`);
const menuContainer = document.querySelector(`.trip-main__visually-hidden-menu`);
const filterContainer = document.querySelector(`.trip-main__visually-hidden-filter`);
const eventsContent = document.querySelector(`.trip-events`);
const pageBodyContainer = document.querySelector(`.page-main .page-body__container`);

const tripInfo = new TripInfo(tripInfoData);
const menu = new Menu(menuData);
const filters = new Filters(filtersData);
const statistics = new Statistics();

const onDataChange = (trips) => {
  tripsMock = trips;
};

const setDisabledValue = (elements, value) => {
  elements.forEach((elem) => {
    elem.disabled = value;
  });
};

let tripsMock = eventsData;
let tripController = new TripController(eventsContent, tripsMock, onDataChange);

statistics.hide();

renderElement(tripInfoContainer, tripInfo.getElement(), `afterbegin`);
renderElement(menuContainer, menu.getElement(), `afterend`);
renderElement(filterContainer, filters.getElement(), `afterend`);
renderElement(pageBodyContainer, statistics.getElement(), `beforeend`);
tripController.init(tripsMock);

const fullTripPriceElem = document.querySelector(`.trip-info__cost-value`);
fullTripPriceElem.textContent = getFullEventPrice(tripsMock);

menu.getElement().addEventListener(`click`, (evt) => {
  evt.preventDefault();
  const target = evt.target;

  if (target.tagName.toLowerCase() !== `a`) {
    return;
  }

  target.classList.add(`trip-tabs__btn--active`);

  if (target.previousElementSibling) {
    target.previousElementSibling.classList.remove(`trip-tabs__btn--active`);
  } else {
    target.nextElementSibling.classList.remove(`trip-tabs__btn--active`);
  }

  switch (target.dataset.switch) {
    case `table`:
      statistics.hide();
      tripController.show();
      setDisabledValue(filters.getElement().querySelectorAll(`.trip-filters__filter-input`), false);
      break;
    case `stats`:
      tripController.onChangeView();
      tripController.hide();
      statistics.show(tripsMock);
      setDisabledValue(filters.getElement().querySelectorAll(`.trip-filters__filter-input`), true);
      break;
  }
});

const addNewPointBtn = document.querySelector(`.trip-main__event-add-btn`);
addNewPointBtn.addEventListener(`click`, () => {
  menu.getElement().querySelector(`a[data-switch="table"]`).classList.add(`trip-tabs__btn--active`);
  menu.getElement().querySelector(`a[data-switch="stats"]`).classList.remove(`trip-tabs__btn--active`);
  statistics.hide();
  tripController.show();
  tripController.createTask();
  setDisabledValue(filters.getElement().querySelectorAll(`.trip-filters__filter-input`), false);
});

const tripFilters = document.querySelector(`.trip-filters`);
tripFilters.addEventListener(`change`, (evt) => {
  const isFiltered = evt.target.value !== `everything`;
  let tripsData = tripsMock;

  switch (evt.target.value) {
    case `everything`:
      tripsData = tripsMock;
      addNewPointBtn.disabled = false;
      break;
    case `future`:
      tripsData = tripsMock.filter((trip) => trip.eventTime.from.isAfter(new Date(Date.now())));
      addNewPointBtn.disabled = true;
      break;
    case `past`:
      tripsData = tripsMock.filter((trip) => trip.eventTime.from.isBefore(new Date(Date.now())));
      addNewPointBtn.disabled = true;
      break;
  }

  tripController = new TripController(eventsContent, tripsData, onDataChange, isFiltered);
  tripController.init();
});
