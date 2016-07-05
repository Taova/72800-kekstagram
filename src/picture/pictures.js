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
  this.data = data;
  this.element = getPicture(data, container);
  this.onPicturesClick = function(evt) {
    evt.preventDefault();
    if (evt.target.tagName === 'IMG') {
      evt.preventDefault();
      location.hash = '#photo/' +  data.url;
      // var returnIndex = gallery.findIndexPhoto(evt.target.src);
      // gallery.showPhoto(returnIndex);
      // gallery.showGallery();
    }
  };
  this.onPicturesKeydown = function(evt) {
    if (utils.isActivationEvent(evt)) {
      if (evt.target.classList.contains('picture')) {
        evt.preventDefault();
        location.hash = '#photo/' +  data.url;
        // var returnIndex = gallery.findIndexPhoto(evt.target.src);
        // gallery.showPhoto(returnIndex);
        // gallery.showGallery();
      }
    }
  };
  this.remove = function() {
    this.element.removeEventListener('click', this.onPicturesClick);
    this.element.removeEventListener('keydown', this.onPicturesKeydown);
    this.element.parentNode.removeChild(this.element);
  };
  this.element.addEventListener('click', this.onPicturesClick);
  this.element.addEventListener('keydown', this.onPicturesKeydown);
  container.appendChild(this.element);
};

module.exports = pictureRender;
