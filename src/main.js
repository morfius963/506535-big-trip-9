import Menu from './js/components/menu.js';
import Filters from './js/components/filters.js';
import TripInfo from './js/components/trip-info.js';
import TripController from './js/controllers/trip-controller.js';
import Statistics from './js/components/statistics.js';
import {eventsData} from './js/data.js';
import {menuData} from './js/data.js';
import {filtersData} from './js/data.js';
import {tripInfoData} from './js/data.js';
import {getFullEventPrice} from './js/utils.js';
import {renderElement} from './js/utils.js';

const tripInfoContainer = document.querySelector(`.trip-main__trip-info`);
const menuContainer = document.querySelector(`.trip-main__visually-hidden-menu`);
const filterContainer = document.querySelector(`.trip-main__visually-hidden-filter`);
const eventsContent = document.querySelector(`.trip-events`);
const pageBodyContainer = document.querySelector(`.page-main .page-body__container`);

const tripInfo = new TripInfo(tripInfoData);
const menu = new Menu(menuData);
const filters = new Filters(filtersData);
const tripController = new TripController(eventsContent, eventsData);
const statistics = new Statistics();

statistics.hide();

renderElement(tripInfoContainer, tripInfo.getElement(), `afterbegin`);
renderElement(menuContainer, menu.getElement(), `afterend`);
renderElement(filterContainer, filters.getElement(), `afterend`);
renderElement(pageBodyContainer, statistics.getElement(), `beforeend`);
tripController.init();

const fullTripPriceElem = document.querySelector(`.trip-info__cost-value`);
fullTripPriceElem.textContent = getFullEventPrice(eventsData);

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
      break;
    case `stats`:
      tripController.hide();
      statistics.show();
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
});
