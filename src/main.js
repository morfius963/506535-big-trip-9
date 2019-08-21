import Menu from './js/components/menu.js';
import Filters from './js/components/filters.js';
import Event from './js/components/event.js';
import EventEdit from './js/components/edit-event.js';
import TripInfo from './js/components/trip-info.js';
import TripContent from './js/components/trip-content.js';
import SortList from './js/components/sort-list.js';
import MainContent from './js/components/main-content.js';
import {eventsData} from './js/data.js';
import {menuData} from './js/data.js';
import {filtersData} from './js/data.js';
import {tripInfoData} from './js/data.js';
import {getFullEventPrice} from './js/utils.js';
import {renderElement} from './js/utils.js';

const tripInfo = new TripInfo(tripInfoData);
const menu = new Menu(menuData);
const filters = new Filters(filtersData);
const sortList = new SortList();
const tripContent = new TripContent();
const mainContent = new MainContent();

const tripInfoContainer = document.querySelector(`.trip-main__trip-info`);
const menuContainer = document.querySelector(`.trip-main__visually-hidden-menu`);
const filterContainer = document.querySelector(`.trip-main__visually-hidden-filter`);
const eventsContent = document.querySelector(`.trip-events`);

renderElement(tripInfoContainer, tripInfo.getElement(), `afterbegin`);
renderElement(menuContainer, menu.getElement(), `afterend`);
renderElement(filterContainer, filters.getElement(), `afterend`);
renderElement(eventsContent, sortList.getElement(), `beforeend`);
renderElement(eventsContent, tripContent.getElement(), `beforeend`);

const tripDaysContent = document.querySelector(`.trip-days`);
renderElement(tripDaysContent, mainContent.getElement(), `beforeend`);
const eventsContainer = document.querySelector(`.trip-events__list`);

const renderEvent = (eventData) => {
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
};

eventsData.forEach((eventItem) => {
  renderEvent(eventItem);
});

const fullTripPriceElem = document.querySelector(`.trip-info__cost-value`);
fullTripPriceElem.textContent = getFullEventPrice(eventsData);
