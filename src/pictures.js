'use strict';

/** @constant {string} */
var PICTURES_LOAD_URL = '//o0.github.io/assets/json/pictures.json';
/** @constant {string} */
var ACTIVE_FILTER_CLASSNAME = 'filter-active';

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
  // elemImgData.onerror = function() {
  //  element.classList.add('picture-load-failure');
  // };
  elemImgData.src = data.url;
  return element;
}
/** @param {function(Array.<Object>)} callback */
var getPictures = function(callback) {
  var xhr = new XMLHttpRequest();

  /** @param {ProgressEvent} */
  xhr.onload = function (evt) {
    var loadedData = JSON.parse(evt.target.response);
    callback(loadedData);

  };
  // xhr.error = fuction(){
  //  picturesContainer.classList.add('picture-load-failure');
  // };
  xhr.open('GET', PICTURES_LOAD_URL);
  xhr.send();
};

/** @param {Array.<Object>} pictures */
var renderPictures = function(pictures) {
  formFilters.innerHTML = '';
  pictures.forEach( function(picture) {
    getPictureElement(picture, picturesContainer);
  });
};

getPictures(function(loadedPictures) {
  pictures = loadedPictures;
  renderPictures(pictures);
});
// Список изображений изменяется  в зависимости переданных значаний filter
/** @param {string} filter */
var SetFiltrationImgId = function(filter) {
  var filterImage = getFilterPictures(pictures, filter);
  renderPictures(filterImage);

  var activeFilter = formFilters.querySelector('.' + ACTIVE_FILTER_CLASSNAME);
  if (activeFilter) {
    activeFilter.classList.remove(ACTIVE_FILTER_CLASSNAME);
  }
  var filterToActivate = document.getElementById(filter);
  filterToActivate.classList.add(ACTIVE_FILTER_CLASSNAME);
};
/**
 * @param {Array.<Object>} hotels
 * @param {string} filter
 */
 var getFilterPictures = function(pictures, filter) {
  var picturesToFilter = pictures.slice(0);

  switch (filter) {
    case 'filter-popular':
      return picturesToFilter;
    break;
    case 'filter-new':
      picturesToFilter.sort(function(a, b) {
        return a.price - b.price;
      });
    break;
    case 'filter-discussed':
      picturesToFilter.sort(function(a, b) {
        return a.price - b.price;
      });
  }
  return picturesToFilter;
};
// Функция добавит обработчики клика элементам фильтра
var SetFiltrationImg = function() {
  var filtersName = formFilters.querySelectorAll('.filters-item');
  for (var i = 0; i < filtersName.length; i++) {
    filtersName[i].onclick = functon(evt) {
      SetFiltrationImgId(this.id);
    }
  }
};
