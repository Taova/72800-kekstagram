/**
 * @fileoverview Показывать список фотографий в полноэкранном режиме.
 * @author Taova
 */
'use strict';

var utils = require('./utils');

var Gallery = function() {
  this.galleryContainer = document.querySelector('.gallery-overlay');
  this.preview = this.galleryContainer.querySelector('.gallery-overlay-image');
  this.closeBlock = this.galleryContainer.querySelector('.gallery-overlay-close');
  this.like = this.galleryContainer.querySelector('.likes-count');
  this.comments = this.galleryContainer.querySelector('.comments-count');

  this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);
  this._onPhotoClick = this._onPhotoClick.bind(this);
  this.hideGallery = this.hideGallery.bind(this);
};

Gallery.prototype.saveGalleryElement = function(data) {
  this.data = data;
};
Gallery.prototype.showPhoto = function(index) {
  var photo = this.data[index];
  this.preview.src = photo.url;
  this.like.textContent = photo.likes;
  this.comments.textContent = photo.comments;
};

Gallery.prototype.findIndexPhoto = function(urlToFind) {
  for (var i = 0; i < this.data.length; i++) {
    if (urlToFind === window.location.href + this.data[i].url) {
      this.indexOfPhoto = i;
    }
  }
  return this.indexOfPhoto;
};


Gallery.prototype.showGallery = function() {
  var galleryContainer = document.querySelector('.gallery-overlay');
  utils.removeClassElem(galleryContainer, 'invisible');

  document.addEventListener('keydown', this._onDocumentKeyDown);
  this.preview.addEventListener('click', this._onPhotoClick);
  this.closeBlock.addEventListener('click', this.hideGallery);
  this.galleryContainer.addEventListener('click', this.hideGallery);
  this.preview.addEventListener('click', this.prevClose);
};

Gallery.prototype._onPhotoClick = function() {
  if (this.indexOfPhoto > this.data.length - 2) {
    this.indexOfPhoto = 0;
  }
  this.indexOfPhoto++;
  this.showPhoto(this.indexOfPhoto);
};

Gallery.prototype._onDocumentKeyDown = function(evt) {
  if (evt.keyCode === 27) {
    this.hideGallery();
  }
};

Gallery.prototype.prevClose = function(evt) {
  evt.stopPropagation();
};
Gallery.prototype.hideGallery = function() {
  utils.addClassElem(this.galleryContainer, 'invisible');

  document.removeEventListener('keydown', this._onDocumentKeyDown);
  this.preview.removeEventListener('click', this._onPhotoClick);
  this.closeBlock.removeEventListener('click', this.hideGallery);
  this.galleryContainer.removeEventListener('click', this.hideGallery);
  this.preview.removeEventListener('click', this.prevClose);
};



var picturesGallery = new Gallery();

module.exports = picturesGallery;
