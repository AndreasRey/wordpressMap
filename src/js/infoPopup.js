import L from 'leaflet';
import '../css/infoPopup.css';
import achileLogoUrl from '../img/ACHILE-logo-couleurs-seul.svg';
import googleMapLogo from '../img/google_maps_logo.svg';


let info = L.control({ position: 'bottomright' });

function openGoogleMaps(lat, lon) {
  var url;
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;

  if (/android/i.test(userAgent)) {
      // Android detected
      url = `geo:${lat},${lon}?q=${lat},${lon}`;
  } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      // iOS detected
      url = `comgooglemaps://?q=${lat},${lon}`;
  } else {
      // Fallback to Google Maps website
      url = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
      window.open(url, '_blank');
      return;
  }

  // Try to open the app, fallback to website if not available
  window.location = url;
}

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
            <p><a class="mapsLink" href="#"><img class="google-maps-logo" src="${googleMapLogo}" alt="Google Maps logo"> Google Maps</a></p>
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
    const mapsLink = this._div.querySelector('.mapsLink');
    if (mapsLink) {
      mapsLink.addEventListener('click', function (event) {
        event.preventDefault();
        openGoogleMaps(props.y, props.x);
      });
    }
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