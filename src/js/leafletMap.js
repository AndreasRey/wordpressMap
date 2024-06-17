import 'leaflet/dist/leaflet.css';
import 'leaflet.locatecontrol';
import 'leaflet.locatecontrol/dist/L.Control.Locate.min.css';
import '../lib/leaflet.fullscreen-v3.0.2/Control.FullScreen.js';
import '../lib/leaflet.fullscreen-v3.0.2/Control.FullScreen.css';
import L from 'leaflet';
import getData from './getData';
import '../css/customLeafletIcon.css';
import setIcon from './customLeafletIcon';

const addMarkers = (map, data) => {
  data.forEach((item) => {
    console.log(item)
    L.marker([item.y, item.x], {
      icon: setIcon('red', false, 'H')
    }).addTo(map);
    // marker.bindPopup(`<b>${item.name}</b><br>${item.address}`);
  });
};

const leafletMap = (divId) => {
  const map = L.map(divId, {
    fullscreenControl: true,
    fullscreenControlOptions: {
      position: 'topleft'
    }
  }).setView([48.86198, 2.33793], 12);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
  L.control.locate().addTo(map);

  getData('./data/centres.json').then(data => {
    // Use the data here
    console.log("data", data)
    const markers = data.markers.map(function (item) {
      return {
        name: item.title,
        address: item.address,
        x: parseFloat(item.lng),
        y: parseFloat(item.lat)
      };
    });
    markers.sort((a, b) => b.y - a.y);
    addMarkers(map, markers);
  }).catch(error => {
    // Handle the error here
  });
};

export default leafletMap;