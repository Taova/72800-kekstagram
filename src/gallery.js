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


  this.galleryPhoto = [];
  this.galleryPhotoSrc = [];
  this.indexOfPhoto = 0;

  this.saveGalleryElement = this.saveGalleryElement.bind(this);

  this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);
  this._onPhotoClick = this._onPhotoClick.bind(this);
  
};

Gallery.prototype.saveGalleryElement = function(data) {
  if (data !== this.galleryPhoto) {
    this.galleryPhoto = [];
    this.galleryPhotoSrc = [];
    this.galleryPhoto = data;

    data.forEach(function(pic) {
      this.galleryPhotoSrc.push(pic.url);
    }, this);
  }
  
};


Gallery.prototype.showGallery = function() {
  console.log(this.galleryContainer);
  this.galleryContainer.classList.remove('invisible');
  this.showPhoto();

  document.addEventListener('keydown', this._onDocumentKeyDown);
  this.preview.addEventListener('click', this._onPhotoClick);
  this.closeBlock.addEventListener('click', this.hideGallery);
  this.galleryContainer.addEventListener('click', this.hideGallery);
  this.preview.addEventListener('click', this.prevClose);
};
Gallery.prototype.showPhoto = function() {
  this.indexOfPhoto = this.galleryPhotoSrc.indexOf(this.indexOfPhoto);
  this.preview.src = this.galleryPhotoSrc[this.indexOfPhoto];
  this.like.innerHTML = this.galleryPhoto[this.indexOfPhoto].likes;
  this.comments.innerHTML = this.galleryPhoto[this.indexOfPhoto].comments;
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
  if (this.indexOfPhotoindexOfPhoto > this.galleryPhoto.length - 2) {
    this.indexOfPhotoindexOfPhoto = 0;
  } else {
    this.indexOfPhoto++;
  }
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

var picturesGallery = new Gallery();

module.exports = {
  saveGallery: picturesGallery.saveGalleryElement,
  showGallery: picturesGallery.showGallery
  // findIndexPhoto: picturesGallery.findIndexPhoto
};
