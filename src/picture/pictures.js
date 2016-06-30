/**
 * @fileoverview Отрисовка изображений
 * @author Taova
 */

'use strict';
var getPicture = require('./get-picture-elem');
var gallery = require('./../gallery');
var utils = require('./../utils');

/**
  * @param {Object} data
  * @param {Element} container
  * @constructor
  */
var pictureRender = function(data, container) {
  var self = this;
  this.data = data;
  this.element = getPicture(data, container);
  /**
    * @param {KeyboardEvent} evt
    */
  pictureRender.prototype.onPicturesClick = function(evt) {
    evt.preventDefault();
    if (evt.target.tagName === 'IMG') {
      gallery.showGallery(gallery.findIndexPhoto(evt.target.src));
    }
  };

  pictureRender.prototype.onPicturesKeydown = function(evt) {
    if (utils.isActivationEvent(evt)) {
      if (evt.target.classList.contains('picture')) {
        evt.preventDefault();
        gallery.showGallery(gallery.findIndexPhoto(evt.target.src));
      }
    }
  };
  pictureRender.prototype.remove = function() {
    self.element.removeEventListener('click', self.onPicturesClick);
    self.element.removeEventListener('keydown', self.onPicturesKeydown);
    self.element.parentNode.removeChild(this.element);
  };
  self.element.addEventListener('click', self.onPicturesClick);
  self.element.addEventListener('keydown', self.onPicturesKeydown);
  container.appendChild(this.element);
};


module.exports = pictureRender;
