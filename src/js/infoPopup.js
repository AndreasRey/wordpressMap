import L from 'leaflet';
import '../css/infoPopup.css';

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
      // htmlString = `
      //   <h4>${props.name}</h4>
      //   <p>${props.address}</p>
      // `;
      htmlString = `
        <div style="display: flex;">
          <div class="popup-image-container">
            <img src="${props.pic}" alt="Location Image" class="popup-image">
          </div>
          <div class="popup-details">
            <h4>${props.name}</h4>
            <p>${props.address}</p>
          </div>
        </div>
      `;


    } else {
      htmlString = `
        <p>Hover over a state</p>
      `;
    }
    this._div.innerHTML = htmlString;
  };

  info.addTo(map);  
}

const updateInfoPopup = (props) => {
  info.update(props);
}

export { createInfoPopup, updateInfoPopup };