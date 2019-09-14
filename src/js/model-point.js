import {TRANSPORT_TYPES} from "./utils.js";

class ModelPoint {
  constructor(data) {
    this.id = data[`id`];
    this.type = {
      value: data[`type`],
      placeholder: TRANSPORT_TYPES.has(data[`type`]) ? `to` : `in`
    };
    this.destination = data[`destination`];
    this.eventTime = {
      from: data[`date_from`],
      to: data[`date_to`]
    };
    this.cost = data[`base_price`];
    this.isFavorite = data[`is_favorite`];
    this.offers = data[`offers`];
    this.currency = `&euro;`;
  }

  static parsePoint(pointData) {
    return new ModelPoint(pointData);
  }

  static parsePoints(pointsData) {
    return pointsData.map(ModelPoint.parsePoint);
  }

  toRAW() {
    return {
      'id': this.id,
      'type': this.type.value,
      'destination': this.destination,
      'date_from': this.eventTime.from,
      'date_to': this.eventTime.to,
      'base_price': this.cost,
      'is_favorite': this.isFavorite,
      'offers': this.offers
    };
  }
}

export default ModelPoint;
