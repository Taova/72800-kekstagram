'use strict';

/* global pictures*/

require('./resizer.js');
require('./upload.js');

/** @constant {string} */
var CLASS_HIDDEN = 'hidden';
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
var renderPhotos = [];

/** @constant {number} */
var THROTTLE_DELAY = 100;
var footerElement = document.querySelector('footer');
var formFilters = document.querySelector('form.filters');


var picturesContainer = document.querySelector('.pictures');
var divContainer = document.querySelector('#no-filters');

var load = require('./load');
var filter = require('./filter/filter');
var filterType = require('./filter/filter-type');
var PictureRender = require('./picture/pictures');
var utils = require('./utils');
var gallery = require('./gallery');

/** @constant {Filter} */
var DEFAULT_FILTER = filterType.popular;

utils.removeClassElem(formFilters, CLASS_HIDDEN);
var setScrollEnabled = function() {
  var lastCall = Date.now();

  window.addEventListener('scroll', function() {
    if (Date.now() - lastCall >= THROTTLE_DELAY) {
      if (utils.isBottomReached(footerElement) &&
        utils.isNextPageAvailable(pictures, pageNumber, PAGE_SIZE)) {
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
    renderPhotos.forEach(function(photo) {
      photo.remove();
    });
    renderPhotos = [];
  }

  var from = page * PAGE_SIZE;
  var to = from + PAGE_SIZE;

  pictures.slice(from, to).forEach(function(picture) {
    renderPhotos.push(new PictureRender(picture, picturesContainer));
  });

  // Если страница не заполненна
  if (document.documentElement.scrollHeight === document.documentElement.clientHeight) {
    pageNumber++;
    renderPictures(pictures, pageNumber, false);
  }
};

load(PICTURES_LOAD_URL, function(loadedPictures) {
  window.pictures = loadedPictures;
  setFiltrationImg();
  setFiltrationImgId(DEFAULT_FILTER);
  setScrollEnabled();
});
// // Список изображений изменяется  в зависимости переданных значаний filterType
// /** @param {string} filterType */
var setFiltrationImgId = function(typeFilter) {
  filterImage = filter(pictures, typeFilter);
  if (filterImage.length === 0) {
    sendEmptyBlock('no-filters', divContainer);

  }
  gallery.saveGallery(filterImage);
  pageNumber = 0;
  renderPictures(filterImage, pageNumber, true);

  var activeFilter = formFilters.querySelector('.' + ACTIVE_FILTER_CLASSNAME);
  if (activeFilter) {
    activeFilter.classList.remove(ACTIVE_FILTER_CLASSNAME);
  }
  var filterToActivate = document.getElementById(typeFilter);
  filterToActivate.classList.add(ACTIVE_FILTER_CLASSNAME);
};

// Функция добавит обработчики клика элементам фильтра
var setFiltrationImg = function() {
  formFilters.addEventListener('click', function(evt) {
    if (evt.target.classList.contains('filters-radio')) {
      setFiltrationImgId(evt.target.id);
    }
  });
};
/**
 * @param {string>} class
 * @param {string} container
 */
var sendEmptyBlock = function(filterclass, container) {
  var div = document.createElement('div');
  div.classList.add(filterclass);
  div.textContent = 'ERROR';
  container.appendChild(div);
};
