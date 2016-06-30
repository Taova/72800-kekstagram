/**
 * @fileoverview Фильтры
 * @author Taova
 */
'use strict';

var filterType = require('./filter-type');

/**
 * @param {Array.<Object>} hotels
 * @param {string} filter
 */
var filter = function(pictures, filters) {
  var picturesToFilter = window.pictures.slice(0);

  switch (filters) {
    case filterType.date:
      picturesToFilter = picturesToFilter.filter(function(a) {
        var lastFourDay = 4 * 24 * 60 * 60 * 1000;
        var imgDate = new Date(a.date);
        return imgDate >= (Date.now() - lastFourDay) && imgDate < Date.now();
      });
      picturesToFilter.sort(function(a, b) {
        return new Date(b.date) - new Date(a.date);
      });
      break;
    case filterType.comments:
      picturesToFilter.sort(function(a, b) {
        return b.comments - a.comments;
      });
      break;
  }
  return picturesToFilter;
};

module.exports = filter;
