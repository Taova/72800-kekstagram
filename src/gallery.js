/**
 * @fileoverview Показывать список фотографий в полноэкранном режиме.
 * @author Taova
 */
'use strict';

var utils = require('./utils');

var Gallery = function() {
  var self = this;
  this.galleryContainer = document.querySelector('.gallery-overlay');
  this.preview = this.galleryContainer.querySelector('.gallery-overlay-image');
  this.closeBlock = this.galleryContainer.querySelector('.gallery-overlay-close');
  this.like = this.galleryContainer.querySelector('.likes-count');
  this.comments = this.galleryContainer.querySelector('.comments-count');
  /** @param {Array.<string>}*/
  this.galleryPhoto = this.saveGalleryElement.bind(this);
  this.indexOfPhoto = this.findIndexPhoto.bind(this);

  this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);
  this._onPhotoClick = this._onPhotoClick.bind(this);
  this.showGallery = this.showGallery.bind(this);
  this.hideGallery = this.hideGallery.bind(this);
  this.prevClose = this.prevClose.bind(this);
};

Gallery.prototype.saveGalleryElement = function(data) {
  this.galleryPhoto = data;
};
Gallery.prototype.findIndexPhoto = function(urlToFind) {
  for (var i = 0; i < this.galleryPhoto.length; i++) {
    if (urlToFind === window.location.href + this.galleryPhoto[i].url) {
      this.indexOfPhoto = i;
    }
  }
  return this.indexOfPhoto;
};

Gallery.prototype.showGallery = function(index) {
  utils.removeClassElem(this.galleryContainer, 'invisible');
  this.showPhoto(index);

  document.addEventListener('keydown', this._onDocumentKeyDown);
  this.preview.addEventListener('click', this._onPhotoClick);
  this.closeBlock.addEventListener('click', this.hideGallery);
  this.galleryContainer.addEventListener('click', this.hideGallery);
  this.preview.addEventListener('click', this.prevClose);
};
Gallery.prototype.showPhoto = function(index) {
  this.preview.src = this.galleryPhoto[index].url;
  this.like.innerHTML = this.galleryPhoto[index].likes;
  this.comments.innerHTML = this.galleryPhoto[index].comments;
};
Gallery.prototype.hideGallery = function() {
  utils.addClassElem(this.galleryContainer, 'invisible');

  document.removeEventListener('keydown', this._onDocumentKeyDown);
  this.preview.removeEventListener('click', this._onPhotoClick);
  this.closeBlock.removeEventListener('click', this.hideGallery);
  this.galleryContainer.removeEventListener('click', this.hideGallery);
  this.preview.removeEventListener('click', this.prevClose);
};

Gallery.prototype._onPhotoClick = function() {
  if (indexOfPhoto > galleryPhoto.length - 2) {
    indexOfPhoto = 0;
  } else {
    indexOfPhoto++;
  }
  this.showPhoto(indexOfPhoto);
};

Gallery.prototype._onDocumentKeyDown = function(evt) {
  if (evt.keyCode === 27) {
    this.hideGallery();
  }
};

Gallery.prototype.prevClose = function(evt) {
  evt.stopPropagation();
};

var picturesGallery = new Gallery();

module.exports = {
  saveGallery: picturesGallery.saveGalleryElement,
  showGallery: picturesGallery.showGallery,
  findIndexPhoto: picturesGallery.findIndexPhoto
};
