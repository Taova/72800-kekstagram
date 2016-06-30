/**
 * @fileoverview Показывать список фотографий в полноэкранном режиме.
 * @author Taova
 */
'use strict';

var utils = require('./utils');

var Gallery = function() {
  var self = this;
  this.galleryContainer = document.querySelector('.gallery-overlay');
  var preview = this.galleryContainer.querySelector('.gallery-overlay-image');
  var closeBlock = this.galleryContainer.querySelector('.gallery-overlay-close');
  var like = this.galleryContainer.querySelector('.likes-count');
  var comments = this.galleryContainer.querySelector('.comments-count');
  /** @param {Array.<string>}*/
  var galleryPhoto = [];
  var indexOfPhoto;
  this.saveGalleryElement = function(data) {
    galleryPhoto = data;
  };
  this.findIndexPhoto = function(urlToFind) {
    for (var i = 0; i < galleryPhoto.length; i++) {
      if (urlToFind === window.location.href + galleryPhoto[i].url) {
        indexOfPhoto = i;
      }
    }
    return indexOfPhoto;
  };

  this.showGallery = function(index) {
    utils.removeClassElem(self.galleryContainer, 'invisible');
    self.showPhoto(index);

    document.addEventListener('keydown', self._onDocumentKeyDown);
    preview.addEventListener('click', self._onPhotoClick);
    closeBlock.addEventListener('click', self.hideGallery);
    self.galleryContainer.addEventListener('click', self.hideGallery);
    preview.addEventListener('click', self.prevClose);
  };
  this.showPhoto = function(index) {
    preview.src = galleryPhoto[index].url;
    like.innerHTML = galleryPhoto[index].likes;
    comments.innerHTML = galleryPhoto[index].comments;
  };
  this.hideGallery = function() {
    utils.addClassElem(self.galleryContainer, 'invisible');

    document.removeEventListener('keydown', self._onDocumentKeyDown);
    preview.removeEventListener('click', self._onPhotoClick);
    closeBlock.removeEventListener('click', self.hideGallery);
    self.galleryContainer.removeEventListener('click', self.hideGallery);
    preview.removeEventListener('click', self.prevClose);
  };

  this._onPhotoClick = function() {
    if (indexOfPhoto > galleryPhoto.length - 2) {
      indexOfPhoto = 0;
    } else {
      indexOfPhoto++;
    }
    self.showPhoto(indexOfPhoto);
  };

  this._onDocumentKeyDown = function(evt) {
    if (evt.keyCode === 27) {
      self.hideGallery();
    }
  };

  this.prevClose = function(evt) {
    evt.stopPropagation();
  };
};

var picturesGallery = new Gallery();

module.exports = {
  saveGallery: picturesGallery.saveGalleryElement,
  showGallery: picturesGallery.showGallery,
  findIndexPhoto: picturesGallery.findIndexPhoto
};
