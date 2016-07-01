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

  this.onPicturesClick = this.onPicturesClick.bind(this);
  this.onPicturesKeydown = this.onPicturesClick.bind(this);

  self.element.addEventListener('click', self.onPicturesClick);
  self.element.addEventListener('keydown', self.onPicturesKeydown);
  container.appendChild(this.element);
};
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
  this.element.removeEventListener('click', this.onPicturesClick);
  this.element.removeEventListener('keydown', this.onPicturesKeydown);
  this.element.parentNode.removeChild(this.element);
};

module.exports = pictureRender;
