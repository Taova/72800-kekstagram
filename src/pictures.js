/**
 * @fileoverview Загрузка изображений
 * @author Taova
 */

'use strict';
/* global pictures*/
/** @type {Array.<Object>} */
var filterImage = [];
/** @constant {string} */
var PICTURES_LOAD_URL = '//o0.github.io/assets/json/pictures.json';
/** @constant {string} */
var ACTIVE_FILTER_CLASSNAME = 'filter-active';
/** @constant {number} */
var PAGE_SIZE = 12;
/** @type {number} */
var pageNumber = 0;
/** @constant {Filter} */
var DEFAULT_FILTER = 'filter-popular';
/** @constant {number} */
var THROTTLE_DELAY = 100;

var formFilters = document.querySelector('form.filters');
formFilters.classList.add('hidden');

var picturesContainer = document.querySelector('.pictures');
var templateElement = document.querySelector('#picture-template');
var divContainer = document.querySelector('#no-filters');
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
/** @param {function(Array.<Object>)} callback */
var getPictures = function(callback) {
  var xhr = new XMLHttpRequest();

  /** @param {ProgressEvent} */
  xhr.onload = function(evt) {
    var loadedData = JSON.parse(evt.target.response);
    callback(loadedData);
  };
  // xhr.error = fuction(){
  //  picturesContainer.classList.add('picture-load-failure');
  // };
  xhr.open('GET', PICTURES_LOAD_URL);
  xhr.send();
};

var setScrollEnabled = function() {
  var lastCall = Date.now();

  window.addEventListener('scroll', function() {
    if (Date.now() - lastCall >= THROTTLE_DELAY) {
      if (isBottomReached() &&
        isNextPageAvailable(pictures, pageNumber, PAGE_SIZE)) {
        pageNumber++;
        renderPictures(filterImage, pageNumber);
      }
      lastCall = Date.now();
    }
  });
};

/** @param {Array.<Object>} pictures
  * @param {number} page
  */
var renderPictures = function(pictures, page, replace) {
  if (replace) {
    picturesContainer.innerHTML = '';
  }

  var from = page * PAGE_SIZE;
  var to = from + PAGE_SIZE;

  pictures.slice(from, to).forEach(function(picture) {
    getPictureElement(picture, picturesContainer);
  });

  // Если страница не заполненна
  if (document.documentElement.scrollHeight === document.documentElement.clientHeight) {
    pageNumber++;
    renderPictures(pictures, pageNumber, false);
  }
};

getPictures(function(loadedPictures) {
  window.pictures = loadedPictures;
  setFiltrationImg();
  setFiltrationImgId(DEFAULT_FILTER);
  setScrollEnabled();
});
// // Список изображений изменяется  в зависимости переданных значаний filter
// /** @param {string} filter */
var setFiltrationImgId = function(filter) {
  filterImage = getFilterPictures(pictures, filter);
  if (filterImage.length === 0) {
    sendEmptyBlock('no-filters', divContainer);
  } else{
    divContainer.innerHTML = '';
  }
  pageNumber = 0;
  renderPictures(filterImage, pageNumber, true);

  var activeFilter = formFilters.querySelector('.' + ACTIVE_FILTER_CLASSNAME);
  if (activeFilter) {
    activeFilter.classList.remove(ACTIVE_FILTER_CLASSNAME);
  }
  var filterToActivate = document.getElementById(filter);
  filterToActivate.classList.add(ACTIVE_FILTER_CLASSNAME);
};
// /**
//  * @param {Array.<Object>} hotels
//  * @param {string} filter
//  */
var getFilterPictures = function(pictures, filter) {
  var picturesToFilter = window.pictures.slice(0);

  switch (filter) {
    case 'filter-new':
      picturesToFilter = picturesToFilter.filter(function(a) {
        var lastFourDay = 4 * 24 * 60 * 60 * 1000;
        var imgDate = new Date(a.date);
        return imgDate >= (Date.now() - lastFourDay) && imgDate < Date.now();
      });
      picturesToFilter.sort(function(a, b) {
        return new Date(b.date) - new Date(a.date);
      });
      break;
    case 'filter-discussed':
      picturesToFilter.sort(function(a, b) {
        return b.comments - a.comments;
      });
      break;
  }
  return picturesToFilter;
};
// // Функция добавит обработчики клика элементам фильтра
var setFiltrationImg = function() {
  formFilters.addEventListener('click', function(evt) {
    if (evt.target.classList.contains('filters-radio')) {
      setFiltrationImgId(evt.target.id);
    }
  });
};
// /**
//  * @param {string>} class
//  * @param {string} container
//  */
var sendEmptyBlock = function(filterclass, container) {
  var div = document.createElement('div');
  div.classList.add(filterclass);
  div.textContent = 'ERROR';
  container.appendChild(div);
};
/** @return {boolean} */
var isBottomReached = function() {
  var GAP = 100;
  var footerElement = document.querySelector('footer');
  var footerPosition = footerElement.getBoundingClientRect();
  return footerPosition.top - window.innerHeight - GAP <= 0;
};

/** @param {Array} pictures
  * @param {number} page
  * @param {number} pagesize
  * @return {boolean}
  */
var isNextPageAvailable = function(pictures, page, pagesize) {
  return page < Math.ceil(pictures.length / pagesize);
};