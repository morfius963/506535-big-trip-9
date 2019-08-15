import {makeFirstSymUp} from '../utils.js';

export const makeEventItemTemplate = ({type: {value, placeholder}, city, eventTime: {from, to, activityTime}, cost}) => (
  `<li class="trip-events__item">
    <div class="event">
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${value}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${makeFirstSymUp(value)} ${placeholder} ${city}</h3>

      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${from.date}T${from.time}">${from.time}</time>
          &mdash;
          <time class="event__end-time" datetime="${to.date}T${to.time}">${to.time}</time>
        </p>
        <p class="event__duration">${activityTime}</p>
      </div>

      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${cost}</span>
      </p>

      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`
);
