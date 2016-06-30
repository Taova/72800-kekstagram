/**
 * @fileoverview Загрузка изображений
 * @author Taova
 */
'use strict';
/**
  * Подключение зависимости библиотеки browser-cookies в переменную
  */
var browserCookies = require('browser-cookies');

var KeyCode = {
  ENTER: 13,
  ESC: 27,
  SPACE: 32
};

module.exports = {
  isActivationEvent: function(evt) {
    return [KeyCode.ENTER, KeyCode.SPACE].indexOf(evt.keyCode) > -1;
  },
  isDeactivationEvent: function(evt) {
    return evt.keyCode === KeyCode.ESC;
  },
  /** @return {boolean} */
  isBottomReached: function(elem) {
    var GAP = 100;
    var footerPosition = elem.getBoundingClientRect();
    return footerPosition.top - window.innerHeight - GAP <= 0;
  },
  /** @param {Array} pictures
  * @param {number} page
  * @param {number} pagesize
  * @return {boolean}
  */
  isNextPageAvailable: function(pictures, page, pagesize) {
    return page < Math.ceil(pictures.length / pagesize);
  },
  /**
  * Функция сохранения в cookies последний выбранный фильтр:
  * «Оригинал», «Хром» или «Сепия»
  */
  saveSelectFilter: function() {
    var selectFilter = document.querySelector('.upload-filter-controls input:checked');
    var yourBithDay = new Date();
    yourBithDay.setMonth(3);
    yourBithDay.setDate(23);
    var timeNow = (Date.now() - yourBithDay) / 24 * 60 * 60 * 1000;
    if (timeNow < 0) {
      timeNow = timeNow + 365;
    }
    browserCookies.set('filter', toString(selectFilter.value), {expires: timeNow});
  },
  //Устанавливаем фильтр, записанный в cookies, по умолчанию.
  setDefaultFilter: function() {
    var controls = document.querySelector('.upload-filter-controls');
    var filterName = browserCookies.get('filter') || 'none';
    var filterSelected = controls.querySelector('#upload-filter-' + filterName);

    filterSelected.setAttribute('checked', true);

  },
  //Преобразование в число
  toNumber: function(num) {
    return parseInt(num, 10);
  },
  // Преобразование в строку
  toString: function(str) {
    return '' + str;
  },
  removeClassElem: function(container, hidden) {
    container.classList.remove(hidden);
  },
  addClassElem: function(container, hidden) {
    container.classList.add(hidden);
  }

};
