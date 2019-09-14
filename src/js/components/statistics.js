import AbstractComponent from "./abstract-component.js";
import moment from "moment";
import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

const MIN_HOURS_COUNT = 1;
const TypeSmiles = new Map([
  [`taxi`, `🚖`],
  [`bus`, `🚌`],
  [`train`, `🚉`],
  [`ship`, `🚢`],
  [`transport`, `🚋`],
  [`drive`, `🚗`],
  [`flight`, `✈️`],
  [`restaurant`, `🍗`],
  [`check-in`, `🏩`],
  [`sightseeing`, `🏛️`]
]);

class Statistics extends AbstractComponent {
  constructor() {
    super();
    this._trips = [];

    this._moneyChartCtx = this.getElement().querySelector(`.statistics__chart--money`);
    this._transportChartCtx = this.getElement().querySelector(`.statistics__chart--transport`);
    this._timeChartCtx = this.getElement().querySelector(`.statistics__chart--time`);

    this._moneyChart = null;
    this._transportChart = null;
    this._timeChart = null;

    Chart.defaults.global.defaultFontColor = `#000000`;
    Chart.defaults.global.defaultFontSize = 18;
  }

  getTemplate() {
    return `<section class="statistics">
      <h2 class="visually-hidden">Trip statistics</h2>

      <div class="statistics__item statistics__item--money">
        <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--transport">
        <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--time-spend">
        <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
      </div>
    </section>`;
  }

  hide() {
    this.getElement().classList.add(`visually-hidden`);
    this._clearCharts(this._moneyChart, this._transportChart, this._timeChart);
  }

  show(trips) {
    if (trips.length === 0) {
      this._setVisibility(`add`, this._moneyChartCtx, this._transportChartCtx, this._timeChartCtx);
      return;
    } else {
      this._setVisibility(`remove`, this._moneyChartCtx, this._transportChartCtx, this._timeChartCtx);
    }

    this._trips = trips;
    this.getElement().classList.remove(`visually-hidden`);

    this._createMoneyChart();
    this._createTransportChart();
    this._createTimeChart();
  }

  _createChart(name, container, labels, data) {
    return new Chart(container, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: `#ffffff`
        }]
      },
      options: {
        title: {
          display: true,
          text: name,
          position: `left`,
          fontSize: 30,
          padding: 30,
        },
        plugins: {
          datalabels: {
            display: true,
            anchor: `end`,
            align: `start`,
            padding: 5,
            formatter(value) {
              if (name === `TRANSPORT`) {
                return `${value}x`;
              } else if (name === `TIME SPENT`) {
                return `${value}H`;
              }

              return `€ ${value}`;
            }
          }
        },
        scales: {
          yAxes: [{
            barPercentage: 0.9,
            maxBarThickness: 60,
            gridLines: {
              display: false,
              drawBorder: false
            }
          }],
          xAxes: [{
            minBarLength: 50,
            ticks: {
              display: false,
              beginAtZero: true
            },
            gridLines: {
              display: false,
              drawBorder: false
            }
          }]
        },
        legend: {
          display: false,
        },
        layout: {
          padding: {
            top: 10,
          }
        },
        tooltips: {
          enabled: true
        },
      }
    });
  }

  _createMoneyChart() {
    const moneyChartLabels = [...new Set(this._trips.map(({type: {value}}) => value.toUpperCase()))];
    const labelsWithSmiles = moneyChartLabels.map((label) => `${TypeSmiles.get(label.toLowerCase())} ${label}`);
    const moneyChartData = moneyChartLabels.reduce((acc, label) => {

      const tripsByLabel = this._trips.filter(({type: {value}}) => value.toUpperCase() === label);
      const labelCost = tripsByLabel.reduce((accum, {cost}) => accum + Number(cost), 0);

      acc.push(labelCost);
      return acc;
    }, []);

    this._moneyChart = this._createChart(`MONEY`, this._moneyChartCtx, labelsWithSmiles, moneyChartData);
  }

  _createTransportChart() {
    const transportsData = this._trips.filter(({type: {placeholder}}) => placeholder === `to`);
    const transportChartLabels = [...new Set(transportsData.map(({type: {value}}) => value.toUpperCase()))];
    const labelsWithSmiles = transportChartLabels.map((label) => `${TypeSmiles.get(label.toLowerCase())} ${label}`);
    const transportChartData = transportChartLabels.reduce((acc, label) => {
      const transportCount = transportsData.filter(({type: {value}}) => value.toUpperCase() === label).length;

      acc.push(transportCount);
      return acc;
    }, []);

    this._transportChart = this._createChart(`TRANSPORT`, this._transportChartCtx, labelsWithSmiles, transportChartData);
  }

  _createTimeChart() {
    const timeChartLabels = [...new Set(this._trips.map(({type: {value}}) => value.toUpperCase()))];
    const labelsWithSmiles = timeChartLabels.map((label) => `${TypeSmiles.get(label.toLowerCase())} ${label}`);
    const timeChartData = timeChartLabels.reduce((acc, label) => {

      const tripsByLabel = this._trips.filter(({type: {value}}) => value.toUpperCase() === label);
      const labelTime = tripsByLabel.reduce((accum, {eventTime: {from, to}}) => accum + (to - from), 0);
      const hoursCount = Math.max(MIN_HOURS_COUNT, Math.floor(moment.duration(labelTime).asHours()));

      acc.push(hoursCount);
      return acc;
    }, []);

    this._timeChart = this._createChart(`TIME SPENT`, this._timeChartCtx, labelsWithSmiles, timeChartData);
  }

  _clearCharts(...charts) {
    charts.forEach((chart) => {
      if (chart) {
        chart.destroy();
      }
    });
  }

  _setVisibility(operation, ...elems) {
    switch (operation) {
      case `add`:
        elems.forEach((elem) => {
          elem.classList.add(`visually-hidden`);
        });
        break;
      case `remove`:
        elems.forEach((elem) => {
          elem.classList.remove(`visually-hidden`);
        });
        break;
      default:
        return;
    }
  }
}

export default Statistics;
