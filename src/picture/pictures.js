/**
 * @fileoverview Отрисовка изображений
 * @author Taova
 */

'use strict';
var getPicture = require('./get-picture-elem');

var pictureRender = function(data, container) {
  var element = getPicture(data, container);
  container.appendChild(element);
};

module.exports = pictureRender;
