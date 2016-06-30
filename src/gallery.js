/**
 * @fileoverview Показывать список фотографий в полноэкранном режиме.
 * @author Taova
 */
'use strict';

var utils = require('./utils');

var Gallery = function() {
  var galleryContainer = document.querySelector('.gallery-overlay');
  var preview = galleryContainer.querySelector('.gallery-overlay-image');
  var closeBlock = galleryContainer.querySelector('.gallery-overlay-close');
  var like = galleryContainer.querySelector('.likes-count');
  var comments = galleryContainer.querySelector('.comments-count');
  /** @param {Array.<string>}*/
  var galleryPictures = [];
  // utils.addClassElem(galleryContainer, 'invisible');
  /** @param {Array.<string>} photos
    * 
    */
  
  this.saveGalleryElement = function(photos) {
    galleryPictures = [];
    galleryPictures = photos;
    photos.forEach(function(photo) {
      var pictureElem = new Image();
      pictureElem.src = photo.url;
      console.log(pictureElem);
    });
  };
  this.showGallery = function(photos, indexPhoto) {
    utils.removeClassElem(galleryContainer, 'invisible');
  };
};

var picturesGallery = new Gallery();

module.exports ={
  saveGallery: picturesGallery.saveGalleryElement,
  showGallery: picturesGallery.showGallery
};
