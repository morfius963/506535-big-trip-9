import {renderElement, getFullEventPrice} from "../utils";
import {getTripInfoData} from "../data.js";
import TripInfo from "../components/trip-info.js";

class PageDataController {
  constructor() {
    this._tripInfoParent = document.querySelector(`.trip-main__trip-info`);
    this._fullTripPriceElem = document.querySelector(`.trip-info__cost-value`);
  }

  updatePage(points) {
    const newTripInfoData = getTripInfoData(points);
    const newTripinfo = new TripInfo(newTripInfoData);
    const tripInfoContainer = document.querySelector(`.trip-info__main`);

    this._tripInfoParent.removeChild(tripInfoContainer);
    renderElement(this._tripInfoParent, newTripinfo.getElement(), `afterbegin`);
    this._fullTripPriceElem.textContent = getFullEventPrice(points);
  }
}

export default PageDataController;
