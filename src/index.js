import _ from 'lodash';
import './css/style.css';
import Icon from './img/icon.png';

function component() {
  let element = document.querySelector('.wordpressmap-content');

  // This is used to create the element if it doesn't exist (for development mode)
  if (!element) {
    element = document.createElement('div');
    element.classList.add('wordpressmap-content');
    document.body.appendChild(element);
  }

  // Lodash, currently included via a script, is required for this line to work
  element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  element.classList.add('hello');

  const myIcon = new Image();
  myIcon.src = Icon;

  element.appendChild(myIcon);

  return element;
}

component();