import './css/style.css';
import leafletMap from './js/leafletMap';

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

  const loadingOverlay = document.createElement('div');
  loadingOverlay.id = 'loading-overlay';

  const spinner = document.createElement('div');
  spinner.className = 'spinner';

  loadingOverlay.appendChild(spinner);

  map.appendChild(loadingOverlay);

  element.appendChild(map);

  const list = document.createElement('div');
  list.id = 'centres-liste';

  element.appendChild(list);
}

document.addEventListener('DOMContentLoaded', () => {
  component();
  let container = document.querySelector('.wordpressmap-content');
  if (container) {
    let mapType = container.getAttribute('data-map-type');
    let type = mapType ? mapType : 'type1';
    leafletMap('map', type);
  }  
});