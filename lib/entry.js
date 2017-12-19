import * as $ from 'jquery';

document.addEventListener('DOMContentLoaded', () => {
  const $root = $('#root');
  getWeather().then(data => {
    const app = new Weather(data.response[0]);
    app.setup();
    app.render();
  });
})

function getWeather() {
  const id = 'njccsNA6cvtW87pGqERk7';
  const key = 'AfhT5frjzuHwGVRnHBwnqw1tqxc0ib4E2sCJDYjl';
  
  return $.ajax({
    method: 'GET',
    url: `http://api.aerisapi.com/forecasts/11101?client_id=${id}&client_secret=${key}`
  });
}

class Weather {
  constructor(props) {
    this.location = props.profile.tz;
    this.week = props.periods;
    this.defaultView = 'F';
    this.dayStrings = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    this.handleSwitch = this.handleSwitch.bind(this);
  }
  
  setup() {
    this.$root = $('#root');
  }
  
  handleSwitch() {
    this.defaultView = this.defaultView === 'F' ? 'C' : 'F';
    $('.day-list').remove();
    this.renderWeather();
  }

  renderHeader() {
    const location = this.location.split('/');
    const country = location[0];
    const state = location[1].split('_').join(' ');
    const $toggle = this.getToggleButton();
    const $h2 = $('<h2>')
      .text(`Weather for ${state}, ${country}`)
      .addClass('header');
    this.$root.append($h2, $toggle);
  }
  
  getToggleButton() {
    const switchTo = this.defaultView === 'F' ? 'Celcius' : 'Farenheit';
    const $button = $('<button>').append(`Switch to ${switchTo}`)
      .addClass('button')
      .on('click', this.handleSwitch);
      
    return $button;
  }
  
  renderWeather() {
    const $ul = $('<ul>').addClass('day-list');
    this.week.forEach(day => $ul.append(this.createLi(day)));
    this.$root.append($ul);
  }
  
  createLi(day) {
    const date = new Date(day.dateTimeISO);
    const $day = $('<h5>')
      .append(this.dayStrings[date.getDay()])
      .addClass('day');
    const $stamp = $('<h5>')
      .append(`${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`)
      .addClass('date-stamp');
    const $icon = $('<section>')
      .append(`<img src="icons/${day.icon}">`)
      .addClass('icon');
    const $min = $('<span>')
      .append('Low: ' + day[`minTemp${this.defaultView}`] + this.defaultView)
      .addClass('temp');
    const $max = $('<span>')
      .append('High: ' + day[`maxTemp${this.defaultView}`] + this.defaultView)
      .addClass('temp');
    const $li = $('<li>').addClass('day-item');
    $li.append($day, $stamp, $icon, $min, $max);

    return $li;
  }
    
  render() {
    this.renderHeader();
    this.renderWeather();
  }
}

