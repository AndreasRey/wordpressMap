import googleMapLogo from '../img/google_maps_logo.svg';

const googleMapsLink = function (x, y, placeId) {
  return `<a class="mapsLink" href="https://www.google.com/maps/search/?api=1&query=${y}%2C${x}&query_place_id=${placeId}" target="_blank"><img class="google-maps-logo" src="${googleMapLogo}" alt="Google Maps logo"> Google Maps</a>`;
}

export default googleMapsLink;