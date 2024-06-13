import _ from 'lodash';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './css/style.css';
//import Icon from './img/icon.png';

function component() {
  let element = document.querySelector('.wordpressmap-content');

  // This is used to create the element if it doesn't exist (for development mode)
  if (!element) {
    element = document.createElement('div');
    element.classList.add('wordpressmap-content');
    document.body.appendChild(element);
  }

  const map = document.createElement('div');
  map.id = 'map';

  element.appendChild(map);

  return element;
}

component();
var map = L.map('map').setView([48.86198, 2.33793], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);