import 'leaflet/dist/leaflet.css';
import 'leaflet.locatecontrol';
import 'leaflet.locatecontrol/dist/L.Control.Locate.min.css';
import '../lib/leaflet.fullscreen-v3.0.2/Control.FullScreen.js';
import '../lib/leaflet.fullscreen-v3.0.2/Control.FullScreen.css';
import L from 'leaflet';
import getData from './getData';
import setIcon from './customLeafletIcon';
import { createInfoPopup, updateInfoPopup } from './infoPopup';

let featureGroup = L.featureGroup();

// const symbology = "centres-labellises";
const symbology = "c";

const setMarkerColor = (category) => {
  if (symbology === "centres-labellises") {
    return '#F16C76';
  } else {
    if (category === "1") {
      return '#F16C76';
    } else if (category === "2") {      
      return '#00C490';
    } else if (category === "3") {
      return '#FFB056';
    }
  }
};

const refreshMarkers = (clearSelection) => {
  if (clearSelection) {
    featureGroup.eachLayer(function (layer) {
      layer.options.selected = false;
    });
    updateInfoPopup();
  }
  featureGroup.eachLayer(function (layer) {
    layer.setIcon(setIcon(setMarkerColor(layer.options.props.category), layer.options.selected, 'H'));
  });
};


const addMarkers = (map, data) => {  
  data.forEach((item) => {
    let marker = L.marker([item.y, item.x], {
      icon: setIcon(setMarkerColor(item.category), false, 'H'),
      selected: false,
      props: item
    });
    marker.on({
      click: function () {
        refreshMarkers(true);        
        marker.options.selected = true;
        updateInfoPopup(marker.options.props);
        refreshMarkers(false);
      }
    })
    marker.addTo(featureGroup);
    // marker.bindPopup(`<b>${item.name}</b><br>${item.address}`);
  });
  featureGroup.addTo(map);
  map.on('click', function () {
    refreshMarkers(true);
  });
};

const leafletMap = (divId) => {
  const map = L.map(divId, {
    fullscreenControl: true,
    fullscreenControlOptions: {
      position: 'topleft'
    }
  }).setView([48.86198, 2.33793], 9);

  // This focus the map div on first click (to avoid non-educated users not seeing the info popup when clicking on a marker)
  const mapContainer = document.getElementById(divId);

  // Define a one-time event listener for any click within the map container
  const ensureVisibilityOnFirstClick = (e) => {
    const mapBottom = mapContainer.getBoundingClientRect().bottom;
    const isVisible = mapBottom <= window.innerHeight;

    if (!isVisible) {
      mapContainer.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }

    // Remove the event listener after the first invocation
    mapContainer.removeEventListener('click', ensureVisibilityOnFirstClick);
  };

  // Attach the event listener to the map container
  if (mapContainer) {
    mapContainer.addEventListener('click', ensureVisibilityOnFirstClick, { capture: true });
  }
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
  L.control.locate().addTo(map);
  // L.control.scale({ position: 'topright' }).addTo(map);
  map.attributionControl.remove();

  const legendItem = (color, text) => {
    return `<div class="legend-item">
      <span class="legend-span">
        <span
          class="custom-leaflet-icon-legend custom-leaflet-icon-letter-legend"
          style="background-image: radial-gradient(circle, rgba(220,220,220, 1) 10%, ${color} 90%);"
        ></span>
        <span class="letter-icon letter-icon-1-legend">H</span>
      </span>  
      <span class="text-legend">${text}</span>      
      </div>
    `;
  };

  const LegendControl = L.Control.extend({
    options: {
      position: 'topright'
    },
    onAdd: function (map) {
      const container = L.DomUtil.create('div', 'legend');
      let legendItems;
      if (symbology === "centres-labellises") {
        legendItems = [{
          color: setMarkerColor(),
          text: 'Centres labellisés'
        }];
      } else {
        legendItems = [{
          color: setMarkerColor("2"),
          text: 'Etablissements de proximités'
        }, {
          color: setMarkerColor("3"),
          text: 'Etablissements spécialisés'
        }, {
          color: setMarkerColor("1"),
          text: 'Etablissements référents'
        }];
      }
      let legendHtml = '';
      legendItems.forEach((item) => {
        legendHtml += legendItem(item.color, item.text);
      });
      container.innerHTML = legendHtml;
      return container;
    }
  });

  // Add the legend control to the map
  map.addControl(new LegendControl());


  createInfoPopup(map);

  L.control.attribution({ position: 'bottomright', prefix: false }).addTo(map);

  getData('./data/centres.json').then(data => {
    // Use the data here
    console.log("data", data)
    const markers = data.markers.map(function (item) {
      return {
        name: item.title,
        address: item.address,
        x: parseFloat(item.lng),
        y: parseFloat(item.lat),
        pic: item.pic,
        link: item.link,
        category: item.categories[0]
      };
    });
    markers.sort((a, b) => b.y - a.y);
    addMarkers(map, markers);
  }).catch(error => {
    // Handle the error here
  });
};

export default leafletMap;