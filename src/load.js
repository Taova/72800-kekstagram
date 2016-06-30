/**
 * @fileoverview Загрузка изображений
 * @author Taova
 */
'use strict';

var load = function(url, callback) {
  var xhr = new XMLHttpRequest();

  /** @param {ProgressEvent} */
  xhr.onload = function(evt) {
    var loadedData = JSON.parse(evt.target.response);
    callback(loadedData);
  };
  xhr.open('GET', url);
  xhr.send();
};

module.exports = load;
