import L from 'leaflet';

function setIcon (color, selected, letter) {
  const selectionClass = selected ? 'custom-leaflet-icon-selected' : '';
  const spanClass = letter ? `custom-leaflet-icon custom-leaflet-icon-letter ${selectionClass}` : `custom-leaflet-icon ${selectionClass}`;
  const letterSpan = letter ? `<span class="letter-icon letter-icon-1">${letter}</span>` : '';
  const gradientBase = selected ? 'rgba(255,255,255, 1)' : 'rgba(220,220,220, 1)';
  const spanhtml = `
    <span
      class="${spanClass}"
      style="background-image: radial-gradient(circle, ${gradientBase} 10%, ${color} 90%);"
    ></span>
    ${letterSpan}
    <span class="custom-leaflet-icon-shadow"></span>
  `;
  var icon = L.divIcon({
    className: "my-div-icon",
    iconAnchor: [0, 24],
    labelAnchor: [-6, 0],
    popupAnchor: [0, -36],
    html: spanhtml,
    displayColour: color
  })
  return icon
}
export default setIcon;