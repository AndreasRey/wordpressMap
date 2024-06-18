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

const refreshMarkers = (clearSelection) => {
  if (clearSelection) {
    featureGroup.eachLayer(function (layer) {
      layer.options.selected = false;
    });
    updateInfoPopup();
  }
  featureGroup.eachLayer(function (layer) {
    layer.setIcon(setIcon('red', layer.options.selected, 'H'));
  });
};

const addMarkers = (map, data) => {  
  data.forEach((item) => {
    let marker = L.marker([item.y, item.x], {
      icon: setIcon('red', false, 'H'),
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
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
  L.control.locate().addTo(map);
  L.control.scale({ position: 'topright' }).addTo(map);
  map.attributionControl.remove();


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
        pic: item.pic
      };
    });
    markers.sort((a, b) => b.y - a.y);
    addMarkers(map, markers);
  }).catch(error => {
    // Handle the error here
  });
};

export default leafletMap;