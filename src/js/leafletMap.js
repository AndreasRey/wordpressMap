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
  }).setView([48.6925713, 2.2912155], 9);

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
  L.control.locate({
    keepCurrentZoomLevel: true,
    flyTo: true
  }).addTo(map);
  map.attributionControl.remove();

  const legendItem = (color, text, layer) => {
    let htmlString = `<div class="legend-item">`;
    if (layer) {
      htmlString += `<input type="checkbox" class="layer-checkbox" data-category-id="${layer}" checked></input>`
    }
    htmlString += `<span class="legend-span">
        <span
        class="custom-leaflet-icon-legend custom-leaflet-icon-letter-legend"
            style="background-image: radial-gradient(circle, rgba(220,220,220, 1) 10%, ${color} 90%);"
          ></span>
      <span class="letter-icon letter-icon-1-legend">H</span>
    </span>  
    <span class="text-legend">${text}</span>      
    </div>
    `;
    return htmlString;
  };

  const HomeControl = L.Control.extend({
    options: {
        position: 'topleft'
    },
    onAdd: function(map) {
        var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-home');
        
        container.style.backgroundColor = 'white';
        container.style.width = '30px';
        container.style.height = '30px';
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.justifyContent = 'center';
        container.style.cursor = 'pointer';

        // Add a home icon or text
        container.innerHTML = '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M32 12L2 42h10v20h18V42h4v20h18V42h10z"/></svg>';

        container.onclick = function() {
            map.flyTo([48.6925713, 2.2912155], 9);
        };

        return container;
    }
});

  const LegendControl = L.Control.extend({
    options: {
      position: 'topright'
    },
    onAdd: function (map) {
      let legendItems;
      let legendClass;
      if (symbology === "centres-labellises") {
        legendItems = [{
          color: setMarkerColor(),
          text: 'Centres labellisés'
        }];
        legendClass = 'legend';
      } else {
        legendItems = [{
          color: setMarkerColor("2"),
          text: 'Etablissements de proximités',
          layer: "2"
        }, {
          color: setMarkerColor("3"),
          text: 'Etablissements spécialisés',
          layer: "3"
        }, {
          color: setMarkerColor("1"),
          text: 'Etablissements référents',
          layer: "1"
        }];
        legendClass = 'legend expanded';
      }
      const container = L.DomUtil.create('div', legendClass);

      let legendHtml = '';
      legendItems.forEach((item) => {
        legendHtml += symbology === "centres-labellises" ? legendItem(item.color, item.text) : legendItem(item.color, item.text, item.layer);
      });

      const LegendIcon = () => {
        return `
          <svg viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
            <circle cx="5" cy="5" r="4" fill="#F16C76" />
            <circle cx="5" cy="15" r="4" fill="#00C490" />
            <circle cx="5" cy="25" r="4" fill="#FFB056" />
            <line x1="12" y1="5" x2="30" y2="5" stroke="black" stroke-width="2" />
            <line x1="12" y1="15" x2="30" y2="15" stroke="black" stroke-width="2" />
            <line x1="12" y1="25" x2="30" y2="25" stroke="black" stroke-width="2" />
          </svg>
        `;
      };
      legendHtml += `<div class="legend-icon">${LegendIcon()}</div>`;

      container.innerHTML = `<div class="legend-content-wrapper">${legendHtml}<span class="legend-toggle-arrow toggle-legend-arrow-down"></span></div>`;

      return container;
    }
  });

  map.addControl(new LegendControl());


    document.querySelectorAll('.layer-checkbox').forEach(checkbox => {
      checkbox.addEventListener('change', function() {
        const categoryId = this.getAttribute('data-category-id');
        const isChecked = this.checked;
        featureGroup.eachLayer(layer => {
          if (layer.options.props.category === categoryId) {
            if (isChecked) {
              layer.addTo(map);
            } else {
              layer.remove();
            }
          }
        });
      });
    });


  document.querySelectorAll('.legend-toggle-arrow, .legend-icon').forEach((element) => {
    element.addEventListener('click', function() {
      const legendControl = this.closest('.legend.leaflet-control');
      const arrow = legendControl.querySelector('.legend-toggle-arrow');

      legendControl.classList.toggle('expanded');

      if (legendControl.classList.contains('expanded')) {
        arrow.classList.remove('toggle-legend-arrow-down');
        arrow.classList.add('toggle-legend-arrow-up');
      } else {
        arrow.classList.remove('toggle-legend-arrow-up');
        arrow.classList.add('toggle-legend-arrow-down');
      }
    });
  });

  map.addControl(new HomeControl());


  createInfoPopup(map);

  L.control.attribution({ position: 'bottomright', prefix: false }).addTo(map);

  getData('	https://www.urgenceschirurgicalesinfantiles-idf.fr/wp-json/wpgmza/v1/features/base64eJyrVkrLzClJLVKyUqqOUcpNLIjPTIlRsopRMoxR0gEJFGeUFni6FAPFomOBAsmlxSX5uW6ZqTkpELFapVoABU0Wug').then(data => {
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
    console.error('Impossible to retrieve data from the server');
    console.error('Error:', error);
  });
};

export default leafletMap;