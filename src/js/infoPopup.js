import L from 'leaflet';
import googleMapsLink from './googleMapsLink';
import '../css/infoPopup.css';
import achileLogoUrl from '../img/ACHILE-logo-couleurs-seul.svg';

let info = L.control({ position: 'bottomright' });

const createInfoPopup = (map) => {
  info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'map-info-popup');
    this.update();
    L.DomEvent.disableClickPropagation(this._div);
    L.DomEvent.disableScrollPropagation(this._div);
    return this._div;
  };

  info.update = function (props) {
    let htmlString;
    
    if (props) {      
      htmlString = `
        <div class="popup-content" style="display: flex;">
          <div class="popup-image-container">
            <img src="${props.pic}" alt="Location Image" class="popup-image">
          </div>
          <div class="popup-details">
            <h3>${props.name}</h3>
            <p>${props.address}</p>
            <p>${googleMapsLink(props.x, props.y, props.placeId)}</p>
            <p><a href="${props.link}" target="_blank">Site internet de l'hôpital</a></p>
          </div>
        </div>
      `;


    } else {
      htmlString = `
        <div class="popup-content popup-content-aligned">
          <img class="popup-achile-logo" src="${achileLogoUrl}" alt="ACHILE logo">
          <p><h3>Centres labellisés</h3></p>
          <p>Click on a marker to see more details.</p>
        </div>
      `;
    }
    this._div.innerHTML = htmlString;
  };
  info.addTo(map);  

  // Workaround to allow scrolling the page through the info popup on mobile devices
  var customControl = document.querySelector('.map-info-popup.leaflet-control');

  var startY;

  customControl.addEventListener('touchstart', function(e) {
      if (e.touches.length === 1) {
          startY = e.touches[0].clientY;
          e.stopPropagation();
      }
  });

  customControl.addEventListener('touchmove', function(e) {
      if (e.touches.length === 1) {
          var touch = e.touches[0];
          var deltaY = touch.clientY - startY;
          window.scrollBy(0, -deltaY); // Scroll the page
          startY = touch.clientY; // Update startY for the next move
          e.stopPropagation();
      }
  });

  customControl.addEventListener('touchend', function(e) {
      if (e.touches.length === 0) {
          e.stopPropagation();
      }
  });
}

const updateInfoPopup = (props) => {
  info.update(props);
}

export { createInfoPopup, updateInfoPopup };