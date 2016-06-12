'use strict';
var formFilters = document.querySelector('form.filters');
formFilters.classList.add('hidden');

var picturesContainer = document.querySelector('.pictures');
var templateElement = document.querySelector('#picture-template');
var elementToClone;

if ('content' in templateElement) {
  elementToClone = templateElement.content.querySelector('.picture');
} else {
  elementToClone = templateElement.querySelector('.picture');
}
/**
 * @param {Object} data
 * @param {HTMLElement} container
 * @return {HTMLElement}
 */
function getPictureElement(data, container) {
  formFilters.classList.remove('hidden');
  var element = elementToClone.cloneNode(true);
  var elemImg = element.querySelector('img');
  element.querySelector('.picture-comments').textContent = data.comments;
  element.querySelector('.picture-likes').textContent = data.likes;
  container.appendChild(element);

  var elemImgData = new Image();
  elemImgData.onload = function() {
    elemImg.src = elemImgData.src;
    elemImgData.width = 182;
    elemImgData.height = 182;
  };
  elemImgData.onerror = function() {
    element.classList.add('picture-load-failure');
  };
  elemImgData.src = data.url;
  return element;
}

window.pictures.forEach( function(picture) {
  getPictureElement(picture, picturesContainer);
});
