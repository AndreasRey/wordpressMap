import _ from 'lodash';
import './css/style.css';
import leafletMap from './js/leafletMap';
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
leafletMap('map');